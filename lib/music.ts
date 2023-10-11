export const pitchNumberToHz = (pitch: number) => 440 * Math.pow(2, (pitch - 69) / 12);

export const semitoneCountFromA3ToHz = (count: number) => {
    // A3: 440 Hz or 442 Hz. Here I set 440 Hz.
    const A3Hz = 440;
    const hz = A3Hz * Math.pow(2, (1 / 12) * (count - 9));
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
    return semitoneCountFromA3ToHz(count);
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
