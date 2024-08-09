export const pitchNumberToHz = (pitch: number) => 440 * Math.pow(2, (pitch - 69) / 12);

export const semitoneCountFromA4ToHz = (count: number) => {
    // A4: 440 Hz or 442 Hz. Here I set 440 Hz.
    const A4Hz = 440;
    const hz = A4Hz * Math.pow(2, (1 / 12) * (count - 9));
    return hz;
};

export const toneToHz = (tone: string) => {
    let count = 0;
    if (tone.startsWith('D')) count = 2;
    if (tone.startsWith('E')) count = 4;
    if (tone.startsWith('F')) count = 5;
    if (tone.startsWith('G')) count = 7;
    if (tone.startsWith('A')) count = 9;
    if (tone.startsWith('B')) count = 11;
    if (tone[1] === '#') count += 1;
    if (tone.endsWith('2')) count -= 24;
    if (tone.endsWith('3')) count -= 12;
    if (tone.endsWith('5')) count += 12;
    return semitoneCountFromA4ToHz(count);
};

export const hzToTone = (hz: number) => {
    const A4Hz = 440;
    const count = Math.round(12 * Math.log2(hz / A4Hz));
    const tone = toneTable[(count + 9) % 12 >= 0 ? (count + 9) % 12 : (count + 9) % 12 + 12];
    const octave = Math.floor(count / 12) + 5;
    return `${tone}${octave}`;
};

export const toneTable = [
    'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
];

export const transpose = (tone: string, octave: number, n: number): [string, number] => {
    const i = toneTable.indexOf(tone);
    const j = i + n;
    if (j >= toneTable.length) {
        return [toneTable[j - toneTable.length], octave + 1];
    }
    return [toneTable[j], octave];
};

type PlaySoundOption = {
    audioContext: AudioContext;
    hz: number;
    second: number;
};

export const playSound = ({ audioContext, hz, second }: PlaySoundOption) => {
    const oscillator = audioContext.createOscillator();
    oscillator.frequency.value = hz;
    const audioDestination = audioContext.destination;
    const gainNode = audioContext.createGain();
    const currentTime = audioContext.currentTime;
    gainNode.gain.linearRampToValueAtTime(1, currentTime);
    gainNode.gain.linearRampToValueAtTime(0, currentTime + second);
    oscillator.connect(gainNode).connect(audioDestination);
    oscillator.start();
    setTimeout(() => {
        oscillator.stop();
    }, 1000 * second);
};
