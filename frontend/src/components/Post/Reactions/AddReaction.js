import React from "react";
import { connect } from "react-redux";
import { ClassNames } from "../../../styles/classes";
import { Button } from "../../../structure/Form/Form";
import { ReactionMapping, Reactions } from "../../../common/enums";
import { addNewReaction, deleteReaction, updateReaction } from "../../../redux/actions/actions";
import { selectApiState } from "../../../redux/reducers/apiReducer";
import { REACTIONS_ROUTES } from "../../../config/apiRoutes";
import { userHasReacted } from "../../../common/utils";

const AddReaction = props => {

    const { post, comment, auth, handleClose } = props;

    const handleReact = type => {
        let alreadyReacted = null;
        const finalBody = {};

        // find if user already placed a reaction
        if (comment != null) {
            alreadyReacted = userHasReacted(auth, comment);
        } else {
            alreadyReacted = userHasReacted(auth, post);
        }

        if(alreadyReacted) {
            if (type === alreadyReacted.reactionType) {
                // delete
                finalBody.id = alreadyReacted.id;
                props.deleteReaction(finalBody);
            } else {
                // update
                finalBody.id = alreadyReacted.id;
                finalBody.reactionType = parseInt(type);
                props.updateReaction(finalBody);
            }
        } else {
            // add new
            finalBody.postId = post.id;
            finalBody.reactionType = parseInt(type);
            if (comment != null) {
                finalBody.commentId = comment.id;
            }
            props.addNewReaction(finalBody);
        }
        handleClose();
    }

    return (
        <React.Fragment>
            <div className={ClassNames.REACTION_BTNS}>
                {Object.values(Reactions).map(reaction => {
                    return (
                        <Button className={'emoticon'} onClick={() => handleReact(reaction)}>
                            <span className="icon">
                                {ReactionMapping[reaction].icon}
                            </span>
                            <span className="name">{ReactionMapping[reaction].name}</span>
                        </Button>
                    )
                })}
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    auth: state.auth,
    addNewReactionResponse: selectApiState(state, REACTIONS_ROUTES.ADD_NEW_REACTION.name),
    updateReactionResponse: selectApiState(state, REACTIONS_ROUTES.ADD_NEW_REACTION.name),
    deleteReactionResponse: selectApiState(state, REACTIONS_ROUTES.ADD_NEW_REACTION.name),
})

const mapDispatchToProps = dispatch => ({
    addNewReaction: data => dispatch(addNewReaction(data)),
    updateReaction: data => dispatch(updateReaction(data)),
    deleteReaction: data => dispatch(deleteReaction(data)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddReaction)