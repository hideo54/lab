import Link from 'next/link';
import styled from 'styled-components';
import { StyledIcon } from '@styled-icons/styled-icon';
import { ChevronBack } from '@styled-icons/ionicons-outline';

export const IconLink: React.FC<{
    LeftIcon?: StyledIcon;
    RightIcon?: StyledIcon;
    href: string;
}> = ({ children, LeftIcon, RightIcon, href }) => {
    const Left = LeftIcon && styled(LeftIcon)`
        vertical-align: text-bottom;
        margin-right: 0.2em;
    `;
    const Right = RightIcon && styled(RightIcon)`
        vertical-align: text-bottom;
        margin-left: 0.2em;
    `;
    if (href.startsWith('/')) {
        return (
            <Link href={href}>
                <a>
                    {LeftIcon && <Left size={'1.2em'} />}
                    {children}
                    {RightIcon && <Right size={'1.2em'} />}
                </a>
            </Link>
        );
    }
    return (
        <a href={href} target='_blank'>
            {LeftIcon && <Left size={'1.2em'} />}
            {children}
            {RightIcon && <Right size={'1.2em'} />}
        </a>
    );
};

const GoTopDiv = styled.div`
    margin-top: 1em;
    padding-left: 1em;
`;

export const goTopHeader = (
    <GoTopDiv>
        <IconLink LeftIcon={ChevronBack} href='/'>トップページ</IconLink>
    </GoTopDiv>
);
