import React, { useEffect, useState } from 'react';
import { ClassNames } from '../../../styles/classes';
import { Form, LoadingButton } from '../../../structure/Form/Form';
import TextInput from '../../../structure/Form/TextInput';
import { removeEmptyFields } from '../../../common/utils';
import { COMMENTS_ROUTES } from '../../../config/apiRoutes';
import { selectApiState } from '../../../redux/reducers/apiReducer';
import { connect } from 'react-redux';
import { addNewComment, clearData } from '../../../redux/actions/actions';
import { MdSend } from 'react-icons/md';

const AddComment = props => {
    const [inputs, setInputs] = useState({});
    const [addCommentCall, setAddCommentCall] = useState(false);

    const { commentRef, isReply, post, comment, inputFocus } = props;

    useEffect(() => {
        if (props.addCommentResponse && props.addCommentResponse.success && !addCommentCall) {
            props.clearData([COMMENTS_ROUTES.ADD_NEW_COMMENT.name]);
            setAddCommentCall(true);
            commentRef.current.style.display = 'none';
            setTimeout(() => {
                setAddCommentCall(false)
            }, 5000);
        }
    }, [props, addCommentCall, commentRef])

    const handleChange = (name, value) => {
        setInputs({
            ...inputs,
            [name]: value,
        });
    }

    const handleAddComment = () => {
        const finalBody = removeEmptyFields(inputs);
        if (inputs && inputs.content) {
            setAddCommentCall(false);
            if (isReply) {
                finalBody.commentId = comment.id;
                props.addCommentReply(finalBody);
            } else {
                finalBody.postId = post.id;
                props.addComment(finalBody);
            }
        }
    }

    return (
        <React.Fragment>
            <div className={ClassNames.ADD_COMMENT} ref={commentRef}>
                <Form data={inputs} onChange={handleChange}>
                    <TextInput
                        inputFocus={inputFocus}
                        name={'content'}
                        label={'Add Comment'}
                    />
                </Form>
                <LoadingButton 
                    apiCall={addCommentCall}
                    onClick={handleAddComment}
                    className={ClassNames.MESSAGE_ICON}
                >
                        <MdSend/>
                </LoadingButton>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = (state) => ({
    reactionsResponse: selectApiState(state, COMMENTS_ROUTES.ADD_NEW_COMMENT.name),
});

const mapDispatchToProps = (dispatch) => ({
    addComment: id => dispatch(addNewComment(id)),
    // TODO: Add replies
    clearData: stateValues => dispatch(clearData(stateValues)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddComment);