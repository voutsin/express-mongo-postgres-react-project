import React from 'react';
import { MdFace } from 'react-icons/md';
import styled from 'styled-components';
import { BASE_URL } from '../../config/apiRoutes';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { buildUrl } from '../../common/utils';
import { ClassNames } from '../../styles/classes';

const UserImage = props => {
    const navigate = useNavigate();
    const { picUrl, username, className, id, blockLink, onlineStatus, showStatus } = props;

    const handleClick = e => {
        e.preventDefault();
        if (!blockLink) {
            navigate(buildUrl(`${ROUTES.PROFILE.path}`, { id: id }));
        }
    }

    const StyledDiv = styled.div`
        cursor: pointer;
        position: relative;
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
                {showStatus ? <div className={ClassNames.ONLINE_STATUS}>
                    <span className={`circle ${onlineStatus ? 'online' : ''}`}></span>
                </div> : null}
            </StyledDiv>
        </React.Fragment>
    )
}

export default UserImage;