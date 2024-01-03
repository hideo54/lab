type DurationType =
    | 'whole'
    | 'half'
    | 'quarter'
    | 'eighth'
    | '16th';

export const durationTypeToSec = (bpm: number, durationType: DurationType) => {
    const beatSecond = 4 * 60 / bpm;
    if (durationType === 'whole') return beatSecond;
    if (durationType === 'half') return beatSecond / 2;
    if (durationType === 'quarter') return beatSecond / 4;
    if (durationType === 'eighth') return beatSecond / 8;
    if (durationType === '16th') return beatSecond / 16;
    if (durationType === '32nd') return beatSecond / 32;
    if (durationType === '64th') return beatSecond / 64;
    console.warn(`Unknown durationType: ${durationType}`);
    return 0;
};
