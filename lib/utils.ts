export const notUndefined = <T, >(item: T | undefined): item is T => item !== undefined;

export const pluralize = <T, >(value: T | T[]) => Array.isArray(value) ? value : [value];

export const sleep = async (sec: number) => new Promise(resolve =>
    setTimeout(resolve, sec * 1000)
);