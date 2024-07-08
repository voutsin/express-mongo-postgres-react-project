import React, { useEffect, useState } from 'react';
import { ClassNames } from '../../../styles/classes';
import { Form, LoadingButton } from '../../../structure/Form/Form';
import TextInput from '../../../structure/Form/TextInput';
import { isObjectEmpty, removeEmptyFields } from '../../../common/utils';
import { COMMENTS_ROUTES } from '../../../config/apiRoutes';
import { selectApiState } from '../../../redux/reducers/apiReducer';
import { connect } from 'react-redux';
import { addNewComment, addNewReply, clearData, updateComment } from '../../../redux/actions/actions';
import { MdSend } from 'react-icons/md';

const CommentForm = props => {
    const [inputs, setInputs] = useState({});
    const [commentCall, setCommentCall] = useState(false);
    const [version, setVersion] = useState(0);

    const { commentRef, isReply, post, inputFocus, updatedComment, replyComment } = props;

    useEffect(() => {
        if (props.addCommentResponse && props.addCommentResponse.success && commentCall) {
            props.clearData([COMMENTS_ROUTES.ADD_NEW_COMMENT.name]);
            setCommentCall(false);
            setInputs(Object.assign({}));
            setVersion(version + 1);
            commentRef.current.classList.remove(ClassNames.DISPLAY);
        }

        if (props.updateCommentResponse && props.updateCommentResponse.success && commentCall) {
            props.clearData([COMMENTS_ROUTES.UPDATE_COMMENT.name]);
            setCommentCall(false);
            setInputs(Object.assign({}));
            setVersion(version + 1);
            commentRef.current.classList.remove(ClassNames.DISPLAY);
            props.handleUpdateComment(null);
        }

        if (props.addReplyResponse && props.addReplyResponse.success && commentCall) {
            props.clearData([COMMENTS_ROUTES.REPLY.name]);
            setCommentCall(false);
            setInputs(Object.assign({}));
            setVersion(version + 1);
            commentRef.current.classList.remove(ClassNames.DISPLAY);
        }

    }, [props, commentCall, commentRef, version]);

    useEffect(() => {

        if (updatedComment && isObjectEmpty(inputs)) {
            setInputs(updatedComment);
            commentRef.current.classList.add(ClassNames.DISPLAY);
        }

    }, [updatedComment, inputs, commentRef])

    const handleChange = (name, value) => {
        setInputs({
            ...inputs,
            [name]: value,
        });
        setCommentCall(false);
    }

    const handleAddComment = () => {
        const finalBody = removeEmptyFields(inputs);
        if (inputs && inputs.content) {
            setCommentCall(true);
            if (isReply) {
                finalBody.commentId = replyComment.id;
                props.addCommentReply(finalBody);
            } else {
                finalBody.postId = post.id;
                props.addComment(finalBody);
            }
        }
    }

    const handleUpdateComment = () => {
        if (inputs && inputs.content && updatedComment) {
            const finalBody = {
                id: inputs.id,
                content: inputs.content
            };
            setCommentCall(true);
            props.updateComment(finalBody);
        }
    }

    return (
        <React.Fragment>
            <div className={ClassNames.ADD_COMMENT} ref={commentRef}>
                <Form data={inputs} onChange={handleChange}>
                    <TextInput
                        inputFocus={inputFocus}
                        name={'content'}
                        label={updatedComment ? 'Edit Comment' : 'Add Comment'}
                    />
                </Form>
                <LoadingButton 
                    key={version}
                    apiCall={commentCall}
                    onClick={updatedComment ? handleUpdateComment : handleAddComment}
                    className={ClassNames.MESSAGE_ICON}
                >
                    <MdSend/>
                </LoadingButton>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = (state) => ({
    addCommentResponse: selectApiState(state, COMMENTS_ROUTES.ADD_NEW_COMMENT.name),
    updateCommentResponse: selectApiState(state, COMMENTS_ROUTES.UPDATE_COMMENT.name),
    addReplyResponse: selectApiState(state, COMMENTS_ROUTES.REPLY.name),
});

const mapDispatchToProps = (dispatch) => ({
    addComment: id => dispatch(addNewComment(id)),
    updateComment: data => dispatch(updateComment(data)),
    addCommentReply: id => dispatch(addNewReply(id)),
    clearData: stateValues => dispatch(clearData(stateValues)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CommentForm);