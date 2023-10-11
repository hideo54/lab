export const sleep = async (sec: number) => new Promise(resolve =>
    setTimeout(resolve, sec * 1000)
);
