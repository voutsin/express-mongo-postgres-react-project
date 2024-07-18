import React from 'react';
import { MdFace } from 'react-icons/md';
import styled from 'styled-components';
import { BASE_URL } from '../../config/apiRoutes';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { buildUrl } from '../../common/utils';

const UserImage = props => {
    const navigate = useNavigate();
    const { picUrl, username, className, id, link } = props;

    const handleClick = e => {
        e.preventDefault();
        if (!link) {
            navigate(buildUrl(`${ROUTES.PROFILE.path}`, { id: id }));
        }
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