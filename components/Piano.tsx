type KeyProp = {
    onClick: () => void;
    marginLeft?: number;
};

const WhiteKey: React.FC<KeyProp> = ({ onClick }) => (
    <div
        className='w-10 h-40 bg-white border-solid border-black border-2 [&:not(:last-child)]:border-r-0 cursor-pointer'
        onClick={onClick}
    />
);

const BlackKey: React.FC<KeyProp> = ({ onClick, marginLeft }) => (
    <div
        className='w-8 h-24 bg-black border-solid border-x-[1px] border-white mt-[2px] cursor-pointer'
        style={{
            marginLeft,
        }}
        onClick={onClick}
    />
);

type PianoProp = {
    onClick: (code: string) => void;
};

const Piano: React.FC<PianoProp> = ({ onClick }) => (
    <div className='relative'>
        <div className='absolute flex'>
            <WhiteKey onClick={() => onClick('C')} />
            <WhiteKey onClick={() => onClick('D')} />
            <WhiteKey onClick={() => onClick('E')} />
            <WhiteKey onClick={() => onClick('F')} />
            <WhiteKey onClick={() => onClick('G')} />
            <WhiteKey onClick={() => onClick('A')} />
            <WhiteKey onClick={() => onClick('B')} />
        </div>
        <div className='absolute flex'>
            <BlackKey onClick={() => onClick('C#')} marginLeft={25} />
            <BlackKey onClick={() => onClick('D#')} marginLeft={8} />
            <BlackKey onClick={() => onClick('F#')} marginLeft={48} />
            <BlackKey onClick={() => onClick('G#')} marginLeft={8} />
            <BlackKey onClick={() => onClick('A#')} marginLeft={8} />
        </div>
    </div>
);

export default Piano;
