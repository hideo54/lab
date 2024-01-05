import { notUndefined, pick, sum } from './utils';

type DurationType =
    | 'whole'
    | 'half'
    | '1/2'
    | 'quarter'
    | '1/4'
    | 'eighth'
    | '1/8'
    | '16th'
    | '1/16'
    | '32nd'
    | '1/32'
    | '64th'
    | '1/64';

export const durationTypeToSec = (bpm: number, durationType: DurationType) => {
    const beatSecond = 4 * 60 / bpm;
    if (durationType === 'whole') return beatSecond;
    if (durationType === 'half') return beatSecond / 2;
    if (durationType === '1/2') return beatSecond / 2;
    if (durationType === 'quarter') return beatSecond / 4;
    if (durationType === '1/4') return beatSecond / 4;
    if (durationType === 'eighth') return beatSecond / 8;
    if (durationType === '1/8') return beatSecond / 8;
    if (durationType === '16th') return beatSecond / 16;
    if (durationType === '1/16') return beatSecond / 16;
    if (durationType === '32nd') return beatSecond / 32;
    if (durationType === '1/32') return beatSecond / 32;
    if (durationType === '64th') return beatSecond / 64;
    if (durationType === '1/64') return beatSecond / 64;
    console.warn(`Unknown durationType: ${durationType}`);
    return 0;
};

const pitchNumberToHz = (pitch: number) => 440 * Math.pow(2, (pitch - 69) / 12);

const dotsToMultiple = (dots: number) => sum(
    Array.from({ length: dots + 1 }, (_, i) => (1 / 2) ** i)
);

type PlayCommand = {
    type: 'play';
    hz: number;
    second: number;
};

type PauseCommand = {
    type: 'pause';
    second: number;
};

type BpmChangeCommand = {
    type: 'bpmChange';
    bpm: number;
};

type Command = PlayCommand | PauseCommand | BpmChangeCommand;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseMuseScoreScoreIntoPartCommands = (score: any): Command[][] => {
    const staffs = pick(score, 'Staff');
    const allCommands = staffs.map(staff => {
        const elements = pick(staff, 'Measure').map(measure => pick(measure, 'voice')).flat().flat();
        const commands = elements.map(element => {
            if (element.Tempo) {
                const bpm = pick(
                    pick(element.Tempo, 'tempo')[0], '#text'
                )[0] * 60;
                return {
                    type: 'bpmChange' as const,
                    bpm,
                };
            }

            if (element.Chord) {
                const durationType = pick(
                    pick(element.Chord, 'durationType')[0], '#text'
                )[0];

                const dotsElement = pick(element.Chord, 'dots');
                const dots = dotsElement.length > 0 ? pick(dotsElement[0], '#text')[0] : 0;

                const note = pick(element.Chord, 'Note')[0];
                const pitch = pick(
                    pick(note, 'pitch')[0], '#text'
                )[0];
                const duration = durationTypeToSec(1, durationType) * dotsToMultiple(dots);

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const tie = note.map((e: any) =>
                    e.Spanner && e[':@']['@_type'] === 'Tie'
                        ? e.Spanner
                        : undefined
                ).filter(notUndefined)[0];
                if (tie) {
                    if (pick(tie, 'next')[0]) {
                        // tie の前半なので、後半のぶんまで鳴らす (duration を増やす)
                        const next = pick(tie, 'next')[0];
                        const location = pick(next, 'location')[0];
                        const measures = pick(
                            pick(location, 'measures')[0] || [], '#text'
                        )[0];
                        const fractions = pick(
                            pick(location, 'fractions')[0] || [], '#text'
                        )[0];
                        const nextDuration = ((ms: number | undefined, fr: string) => {
                            if (ms === 1) {
                                if (fr === '-1/2') return durationTypeToSec(1, '1/2');
                                if (fr === '-3/4') return durationTypeToSec(1, '1/4');
                                if (fr === '-7/8') return durationTypeToSec(1, '1/8');
                            }
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            if (ms === undefined) return durationTypeToSec(1, fr as any);
                            console.error('Unknown fractions for "next" tie: ', fr);
                            return 0;
                        })(measures, fractions);
                        return [
                            {
                                type: 'play' as const,
                                hz: pitchNumberToHz(pitch),
                                second: duration + nextDuration,
                            },
                            {
                                type: 'pause' as const,
                                second: duration + nextDuration,
                            },
                        ];
                    }
                    if (pick(tie, 'prev')[0]) {
                        // tie の後半なので、音を鳴らさない
                        return [];
                    }
                } else {
                    return [
                        {
                            type: 'play' as const,
                            hz: pitchNumberToHz(pitch),
                            second: duration,
                        },
                        {
                            type: 'pause' as const,
                            second: duration,
                        },
                    ];
                }
            }

            if (element.Rest) {
                const durationType = pick(
                    pick(element.Rest, 'durationType')[0], '#text'
                )[0];
                if (durationType === 'measure') {
                    const durationText = pick(
                        pick(element.Rest, 'duration')[0], '#text'
                    )[0];
                    if (durationText === '4/4') {
                        return {
                            type: 'pause' as const,
                            second: durationTypeToSec(1, 'whole'),
                        };
                    } else if (durationText === '2/4') {
                        return {
                            type: 'pause' as const,
                            second: durationTypeToSec(1, 'half'),
                        };
                    } else {
                        console.error('Unknown durationText for "while" rest: ', durationText);
                        return {
                            type: 'pause' as const,
                            second: durationTypeToSec(1, 'whole'),
                        };
                    }
                } else {
                    const duration = durationTypeToSec(1, durationType);
                    return {
                        type: 'pause' as const,
                        second: duration,
                    };
                }
            }
        }).flat().filter(notUndefined);
        return commands;
    });
    return allCommands;
};
