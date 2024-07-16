import React, { useState } from "react";
import { Button } from "../../../structure/Form/Form";
import { ClassNames } from "../../../styles/classes";
import TooltipModal from "../../../structure/TooltipModal";
import AddReaction from "../Reactions/AddReaction";
import { userHasReacted } from "../../../common/utils";
import { connect } from "react-redux";
import { MdSentimentSatisfiedAlt } from "react-icons/md";
import { ReactionMapping } from "../../../common/enums";

const ReactButton = props => {
    const [reactModalFlag, setReactModalFlag] = useState(false);

    const { auth, post, comment } = props;

    const toggleReactModal = () => setReactModalFlag(!reactModalFlag);

    const reactModal = (
        <TooltipModal
            handleClose={() => setReactModalFlag(false)}
            flag={reactModalFlag}
        >
            <AddReaction post={post} comment={comment} handleClose={() => setReactModalFlag(false)} />
        </TooltipModal>
    );

    const target = comment != null ? comment : post;
    const alreadyReacted = userHasReacted(auth, target);
    const placedReaction = alreadyReacted && ReactionMapping[alreadyReacted.reactionType];

    return (
        <React.Fragment>
            <Button className={`${ClassNames.REACT}${placedReaction ? ` reacted ${placedReaction.className}` : ''}`} onClick={toggleReactModal}>
                <span className='icon'>
                    {placedReaction ? placedReaction.icon : <MdSentimentSatisfiedAlt/>}
                </span>
                <span>{placedReaction ? placedReaction.name : 'React'}</span>
            </Button>
            {reactModalFlag && reactModal}
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    auth: state.auth,
})

export default connect(
    mapStateToProps
)(ReactButton);