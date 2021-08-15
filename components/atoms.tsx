import Link from 'next/link';
import { StyledIcon } from '@styled-icons/styled-icon';

export const IconLink: React.FC<{
    LeftIcon?: StyledIcon;
    RightIcon?: StyledIcon;
    href: string;
}> = ({ children, LeftIcon, RightIcon, href }) => {
    const left = LeftIcon && <LeftIcon size={'1.2em'} style={{
        verticalAlign: 'text-bottom',
        marginRight: '0.2em',
    }} />;
    const right = RightIcon && <RightIcon size={'1.2em'} style={{
        verticalAlign: 'text-bottom',
        marginLeft: '0.2em',
    }} />;
    if (href.startsWith('/')) {
        return (
            <Link href={href}>
                <a>
                    {left}
                    {children}
                    {right}
                </a>
            </Link>
        );
    }
    return (
        <a href={href} target='_blank' rel="noreferrer">
            {left}
            {children}
            {right}
        </a>
    );
};
