import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ROUTES } from '../../config/routes';
import { buildUrl } from '../../common/utils';

const UserName = props => {
    const navigate = useNavigate();
    const { name, id, blockLink } = props;

    const handleClick = e => {
        e.preventDefault();
        if (!blockLink) {
            navigate(buildUrl(`${ROUTES.PROFILE.path}`, { id: id }));
        }
    }

    const StyledDiv = styled.span`
        cursor: pointer;
    `;

    return (
        <React.Fragment>
            <StyledDiv className={'user-name'} onClick={handleClick}>{name}</StyledDiv>
        </React.Fragment>
    )
}

export default UserName;