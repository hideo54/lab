export const notUndefined = <T, >(item: T | undefined): item is T => item !== undefined;

export const pluralize = <T, >(value: T | T[]) => Array.isArray(value) ? value : [value];

export const sleep = async (sec: number) => new Promise(resolve =>
    setTimeout(resolve, sec * 1000)
);

// ここさえなんとかなれば any をだいぶ減らせるのだが、つらい
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const pick = <T extends Record<string, any>>(arr: T[], key: string) => arr.map(e => e[key]).filter(notUndefined);

export const sum = (arr: number[]) => arr.reduce((acc, val) => acc + val, 0);
