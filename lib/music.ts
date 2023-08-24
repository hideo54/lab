export const semitoneCountFromA3ToHz = (count: number) => {
    // A3: 440 Hz or 442 Hz. Here I set 440 Hz.
    const A3Hz = 440;
    const hz = A3Hz * Math.pow(2, (1 / 12) * (count - 9));
    return hz;
};

export const codeToHz = (code: string) => {
    let count = 0;
    if (code.startsWith('D')) count = 2;
    if (code.startsWith('E')) count = 4;
    if (code.startsWith('F')) count = 5;
    if (code.startsWith('G')) count = 7;
    if (code.startsWith('A')) count = 9;
    if (code.startsWith('B')) count = 11;
    if (code[1] === '#') count += 1;
    if (code.endsWith('2')) count -= 12;
    if (code.endsWith('4')) count += 12;
    if (code.endsWith('5')) count += 24;
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
