export type Instrument = {
    Channel: {
        program: string;
        synti: string;
    };
    clef: string;
    instrumentId: string;
    longName: string;
    maxPitchA: number;
    maxPitchP: number;
    minPitchA: number;
    minPitchP: number;
    shortName: string;
    singleNoteDynamics: 0 | 1;
    trackName: string;
};

export type Part = {
    Instrument: Instrument;
    Staff: {
        StaffType: {
            name: string;
        };
    };
    preferSharpFlat: string; // 'none'
    trackName: string;
};

export type Note = {
    pitch: number;
    tpc: number;
};

export type Chord = {
    durationType:
        | 'whole'
        | 'half'
        | 'quarter'
        | 'eighth'
        | '16th';
    Lyrics?: {
        text: string;
    };
    Note: Note | Note[];
    StemDirection: 'up' | 'down';
};

type Rest = {
    durationType: 'measure';
    duration?: string;
} | {
    durationType: 'whole' | 'half' | 'quarter' | 'eighth' | '16th';
};

export type Staff = {
    Measure: {
        voice: {
            Chord?: Chord | Chord[];
            Clef?: {
                concertClefType: string;
                transposingClefType: string;
                isHeader: 0 | 1;
            };
            Dynamic?: {
                subtype: string;
                velocity: number;
            };
            Harmony?: {
                play: number;
                root: number;
            }[];
            KeySig?: {
                concertKey: number;
            };
            ReharsalMark?: {
                text: string;
            };
            Rest?: Rest | Rest[];
            Spanner?: {
                HairPin: {
                    subtype: number;
                    next: {
                        location: {
                            measures: number;
                            fractions: string;
                        };
                    };
                };
                prev?: {
                    location: {
                        measures: number;
                        fractions: string;
                    };
                };
            };
            Tempo?: {
                tempo: number;
                folowText: 0 | 1;
                bold: 0 | 1;
                text: {
                    b: ({
                        font: string;
                        '#text': string;
                    } | '')[];
                    sym: string;
                };
            };
            TimeSig?: {
                sigD: number;
                sigN: number;
            };
        };
    }[];
    LayoutBreak?: {
        subtype: string;
    };
    VBox?: {
        height: number;
        boxAutoSize: number;
        Text: {
            style: string;
            text: string;
        };
    };
};

export type Score = {
    Division: number;
    Part: Part[];
    Staff: Staff[];
    layoutMode: string;
    metaTag: string[];
    open: 0 | 1;
    showFrames: 0 | 1;
    showInvisible: 0 | 1;
    showMargins: 0 | 1;
    showUnprintable: 0 | 1;
};

export type MuseScore = {
    Score: Score;
    programRevision: string;
    programVersion: string;
};

export const durationTypeToSec = (bpm: number, durationType: Chord['durationType']) => {
    const beatSecond = 4 * 60 / bpm;
    if (durationType === 'whole') return beatSecond;
    if (durationType === 'half') return beatSecond / 2;
    if (durationType === 'quarter') return beatSecond / 4;
    if (durationType === 'eighth') return beatSecond / 8;
    if (durationType === '16th') return beatSecond / 16;
    console.warn(`Unknown durationType: ${durationType}`);
    return 0;
};
