import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ROUTES } from '../../config/routes';

const UserName = props => {
    const navigate = useNavigate();
    const { name, id } = props;

    const handleClick = e => {
        e.preventDefault();
        navigate(ROUTES.PROFILE.path + '/' + id);
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