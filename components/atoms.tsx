import Link from 'next/link';
import { StyledIcon } from '@styled-icons/styled-icon';

export const IconLink: React.FC<{
    LeftIcon?: StyledIcon;
    RightIcon?: StyledIcon;
    href: string;
}> = ({ children, LeftIcon, RightIcon, href }) => {
    if (href.startsWith('/')) {
        return (
            <Link href={href}>
                <a>
                    {LeftIcon && <LeftIcon size={'1.2em'} />}
                    {children}
                    {RightIcon && <RightIcon size={'1.2em'} />}
                </a>
            </Link>
        );
    }
    return (
        <a href={href} target='_blank'>
            {LeftIcon && <LeftIcon size={'1.2em'} />}
            {children}
            {RightIcon && <RightIcon size={'1.2em'} />}
        </a>
    );
};
