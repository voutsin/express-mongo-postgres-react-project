import React, { useState } from 'react'
import { ClassNames } from '../../styles/classes';
import { Button } from '../../structure/Form/Form';
import { MdNotes, MdShare } from 'react-icons/md';
import Modal from '../../structure/Modal';
import ShareModal from './ShareModal';
import ReactButton from './utils/ReactButton';

const PostButtons = props => {
    const [shareModalFlag, setShareModalFlag] = useState(false);

    const { handleAddComment, post } = props;

    const shareModal = (
        <Modal
            handleClose={() => setShareModalFlag(false)}
            flag={shareModalFlag}
        >
            <ShareModal post={post} />
        </Modal>
    );

    return (
        <React.Fragment>
            <div className={ClassNames.POST_BTNS_WRAPPER}>
                <ReactButton post={post} />
                <Button className={ClassNames.COMMENT} onClick={handleAddComment}>
                    <span className='icon'><MdNotes/></span>
                    <span>Comment</span>
                </Button>
                <Button className={ClassNames.SHARE} onClick={() => setShareModalFlag(true)}>
                    <span className='icon'><MdShare/></span>
                    <span>Share</span>
                </Button>
            </div>
            {shareModalFlag && shareModal}
        </React.Fragment>
    )
}

export default PostButtons;