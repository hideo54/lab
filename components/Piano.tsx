const WhiteKey: React.FC<{
    onClick: () => void;
}> = ({ onClick }) => (
    <div
        className='w-1/7 h-full inline-block bg-white border-solid border-black border-2 [&:not(:last-child)]:border-r-0 cursor-pointer'
        onClick={onClick}
    />
);

const BlackKey: React.FC<{
    onClick: () => void;
    left: number;
}> = ({ onClick, left }) => (
    <div
        className='absolute w-1/14 h-7/12 top-0 bg-black border-solid border-x-[1px] border-white mt-[2px] cursor-pointer'
        style={{
            left: `${left * 100}%`,
        }}
        onClick={onClick}
    />
);

type PianoProp = {
    width: string;
    height: string;
    onClick: (code: string) => void;
};

const Piano: React.FC<PianoProp> = ({ width, height, onClick }) => (
    <div className='relative mx-auto' style={{ width, height }}>
        <div className='w-full h-full'>
            <WhiteKey onClick={() => onClick('C')} />
            <WhiteKey onClick={() => onClick('D')} />
            <WhiteKey onClick={() => onClick('E')} />
            <WhiteKey onClick={() => onClick('F')} />
            <WhiteKey onClick={() => onClick('G')} />
            <WhiteKey onClick={() => onClick('A')} />
            <WhiteKey onClick={() => onClick('B')} />
        </div>
        <div>
            <BlackKey left={3 / 28} onClick={() => onClick('C#')} />
            <BlackKey left={7 / 28} onClick={() => onClick('D#')} />
            <BlackKey left={15 / 28} onClick={() => onClick('F#')} />
            <BlackKey left={19 / 28} onClick={() => onClick('G#')} />
            <BlackKey left={23 / 28} onClick={() => onClick('A#')} />
        </div>
    </div>
);

export default Piano;
