import React, { useCallback, useEffect, useState } from 'react';
import { ClassNames } from '../../styles/classes';
import UserImage from '../../structure/User/UserImage';
import { connect } from 'react-redux';
import { Button } from '../../structure/Form/Form';
import Modal from '../../structure/Modal';
import AddNewPostModal from './AddNewPostModal';
import { selectApiState } from '../../redux/reducers/apiReducer';
import { POSTS_ROUTES } from '../../config/apiRoutes';
import { clearData } from '../../redux/actions/actions';

const AddNewPost = props => {
    const [addNewModalFlag, openAddNewModal] = useState(false);
    const [newPostDataFlag, setNewPostDataFlag] = useState(false);

    const { auth, newPostData, clearData } = props;

    const clearNewPostData = useCallback(() => {
        clearData([POSTS_ROUTES.ADD_NEW_POST.name]);
        setNewPostDataFlag(true);
        openAddNewModal(false);
    }, [clearData]);

    useEffect(() => {
        if (newPostData && newPostData.success && !newPostDataFlag) {
            clearNewPostData();
        }

    }, [newPostData, newPostDataFlag, clearNewPostData])

    const addNewModal = (
        <Modal
            handleClose={() => openAddNewModal(false)}
            flag={addNewModalFlag}
        >
            <AddNewPostModal/>
        </Modal>
    )

    return (
        <React.Fragment>
            <div className={ClassNames.ADD_NEW_POST_ACTION}>
                <div className={ClassNames.TRIGGER_DIV}>
                    <UserImage
                        id={auth.id}
                        picUrl={auth.profilePictureThumb}
                        username={auth.username}
                        className={ClassNames.THUMBNAIL_IMG}
                    />
                    <Button className={ClassNames.ADD_NEW_POST_BTN} onClick={() => openAddNewModal(true)}>
                        Share new post...
                    </Button>
                </div>
                {addNewModalFlag && addNewModal}
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    auth: state.auth,
    newPostData: selectApiState(state, POSTS_ROUTES.ADD_NEW_POST.name)
});

const mapDispatchToProps = dispatch => ({
    clearData: stateValues => dispatch(clearData(stateValues)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AddNewPost);