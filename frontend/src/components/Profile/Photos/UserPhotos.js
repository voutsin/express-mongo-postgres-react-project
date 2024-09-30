import React, { useEffect, useState } from "react";
import Loader from "../../../structure/Loader";
import { BASE_URL, USERS_ROUTES } from "../../../config/apiRoutes";
import { connect } from "react-redux";
import { selectApiState } from "../../../redux/reducers/apiReducer";
import { getUserMedia } from "../../../redux/actions/actions";
import Slider from "./Slider";
import { ClassNames } from "../../../styles/classes";

const UserPhotos = props => {
    const [loading, setLoading] = useState(true);
    const [userPhotosCall, setUserPhotosCall] = useState(false);
    const [userPhotos, setUserPhotos] = useState(false);
    const [photoModalTarget, openPhotoModal] = useState(null);

    const { userId, getUserMedia, useMediaList } = props;

    useEffect(() => {
        if (userId) {
            getUserMedia(userId);
        }
    }, [getUserMedia, userId]);

    useEffect(() => {
        if (useMediaList && useMediaList.success && !userPhotosCall) {
            const photos = [
                ...useMediaList.data,
            ]
            setUserPhotosCall(true);
            setLoading(false);
            setUserPhotos(photos.filter((p, index) => index < 9));
        }

        if (!useMediaList || !useMediaList.success) {
            setUserPhotosCall(false);
            setUserPhotos(false);
        }

    }, [useMediaList, userPhotosCall]);

    const handleOpenPhoto = index => {
        const photo = userPhotos[index];
        openPhotoModal(photo);
    }

    if (loading) {
        return <Loader mini={true}/>
    }

    const photoModal = <Slider photos={userPhotos} target={photoModalTarget} handleClose={() => openPhotoModal(null)}/>

    return (
        <React.Fragment>
            <div className={ClassNames.USER_PHOTOS_WRAPPER}>
                <h4>Photos</h4>
                <div className={ClassNames.USER_PHOTOS_LIST}>
                    {userPhotos && userPhotos.length > 0 && 
                        userPhotos.map((photo, index) => {
                            return(
                                <div key={`img-${index}-${photo.name}`} className={ClassNames.USER_PHOTO_ITEM} onClick={() => handleOpenPhoto(index)}>
                                    <div className="pic">
                                        <img alt={`img-${index}-${photo.name}`} src={`${BASE_URL}${photo.thumbnailUrl}`} width={'100%'} height={'auto'}/>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            {photoModalTarget && photoModal}
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    useMediaList: selectApiState(state, USERS_ROUTES.FIND_USER_MEDIA.name),
});

const mapDispatchToProps = dispatch => ({
    getUserMedia: userId => dispatch(getUserMedia(userId)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserPhotos);