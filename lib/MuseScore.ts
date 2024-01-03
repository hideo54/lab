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
