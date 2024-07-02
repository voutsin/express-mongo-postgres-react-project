import React from 'react';
import { MdFace } from 'react-icons/md';
import styled from 'styled-components';
import { BASE_URL } from '../../config/apiRoutes';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';

const UserImage = props => {
    const navigate = useNavigate();
    const { picUrl, username, className, id } = props;

    const handleClick = e => {
        e.preventDefault();
        navigate(ROUTES.PROFILE.path + '/' + id);
    }

    const StyledDiv = styled.div`
        cursor: pointer;
    `;

    return (
        <React.Fragment>
            <StyledDiv className={className} onClick={handleClick}>
                {picUrl ? 
                    <img 
                        src={`${BASE_URL}/${picUrl}`} 
                        alt={username}
                    /> 
                    : <MdFace /> 
                }
            </StyledDiv>
        </React.Fragment>
    )
}

export default UserImage;