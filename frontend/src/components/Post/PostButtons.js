import React, { useState } from 'react'
import { ClassNames } from '../../styles/classes';
import { Button } from '../../structure/Form/Form';
import { MdNotes, MdSentimentSatisfiedAlt, MdShare } from 'react-icons/md';
import Modal from '../../structure/Modal';
import ShareModal from './ShareModal';
import TooltipModal from '../../structure/TooltipModal';
import AddReaction from './Reactions/AddReaction';
import { userHasReacted } from '../../common/utils';
import { connect } from 'react-redux';
import { ReactionMapping } from '../../common/enums';

const PostButtons = props => {
    const [reactModalFlag, setReactModalFlag] = useState(false);
    const [shareModalFlag, setShareModalFlag] = useState(false);

    const { handleAddComment, post, auth } = props;

    const toggleReactModal = () => setReactModalFlag(!reactModalFlag);

    const reactModal = (
        <TooltipModal
            handleClose={() => setReactModalFlag(false)}
            flag={reactModalFlag}
        >
            <AddReaction post={post} handleClose={() => setReactModalFlag(false)} />
        </TooltipModal>
    );

    const shareModal = (
        <Modal
            handleClose={() => setShareModalFlag(false)}
            flag={shareModalFlag}
        >
            <ShareModal post={post} />
        </Modal>
    );

    const alreadyReacted = userHasReacted(auth, post);
    const placedReaction = alreadyReacted && ReactionMapping[alreadyReacted.reactionType];

    return (
        <React.Fragment>
            <div className={ClassNames.POST_BTNS_WRAPPER}>
                <Button className={`${ClassNames.REACT}${placedReaction ? ` reacted ${placedReaction.className}` : ''}`} onClick={toggleReactModal}>
                    <span className='icon'>
                        {placedReaction ? placedReaction.icon : <MdSentimentSatisfiedAlt/>}
                    </span>
                    <span>{placedReaction ? placedReaction.name : 'React'}</span>
                </Button>
                <Button className={ClassNames.COMMENT} onClick={handleAddComment}>
                    <span className='icon'><MdNotes/></span>
                    <span>Comment</span>
                </Button>
                <Button className={ClassNames.SHARE} onClick={() => setShareModalFlag(true)}>
                    <span className='icon'><MdShare/></span>
                    <span>Share</span>
                </Button>
            </div>
            {reactModalFlag && reactModal}
            {shareModalFlag && shareModal}
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    auth: state.auth,
})

export default connect(
    mapStateToProps
)(PostButtons);