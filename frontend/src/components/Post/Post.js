import React, { useCallback, useEffect, useRef, useState } from "react";
import UserImage from "../../structure/User/UserImage";
import { ClassNames } from "../../styles/classes";
import UserName from "../../structure/User/UserName";
import { Media, calculatePostAge, extractUrls, getYoutubeVideoId } from "../../common/utils";
import Modal from "../../structure/Modal";
import ReactionsSection from "./Reactions/Reactions";
import PostButtons from "./PostButtons";
import { connect } from "react-redux";
import { selectApiState, selectPostsData, selectTopFeeds } from "../../redux/reducers/apiReducer";
import FeedComment from "../Feed/FeedComment";
import CommentsSection from "../Post/Comments/Comments";
import { Button } from "../../structure/Form/Form";
import { MdMoreVert } from "react-icons/md";
import TooltipModal from "../../structure/TooltipModal";
import OptionsModal from "./utils/OptionsModal";
import PostFormModal from "../AddNewPost/PostFormModal";
import { POSTS_ROUTES } from "../../config/apiRoutes";
import { clearData } from "../../redux/actions/actions";

const Post = props => {
    const textRef = useRef(null);
    const [imageMopdalFlag, openImageModal] = useState(false);
    const [mediaHeight, setMediaHeight] = useState('600px');
    const [commentsModalFlag, openCommentsModal] = useState(false);
    const [linkPreview, setLinkPreview] = useState(false);
    const [optionsModalFlag, openOptionsModal] = useState(false);
    const [updateModalFlag, openUpdateModal] = useState(false);
    const [updatePostDataFlag, setUpdatePostDataFlag] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [textToggle, setTextToggle] = useState(false);

    const {post, fullWidth, posts, topFeeds, updatePostData} = props;

    const foundPost = posts ? posts.find(p => p.id === post.id) : post;
    const foundTopFeed = topFeeds ? topFeeds.find(f => f.content.postId === post.id) : null;

    const clearUpdatePostData = useCallback(() => {
        setUpdatePostDataFlag(true);
        openUpdateModal(false);
    }, []);

    useEffect(() => {
        if (updatePostData && updatePostData.success && !updatePostDataFlag) {
            clearUpdatePostData();
        }

    }, [updatePostData, updatePostDataFlag, clearUpdatePostData])

    useEffect(() => {
        if (foundPost) {
            const urlsInContent = foundPost ? extractUrls(foundPost.content) : false;
            if (urlsInContent && urlsInContent.length > 0) {
                const firstUrl = urlsInContent[0];
                const youtubeVideoId = getYoutubeVideoId(firstUrl);
                if (youtubeVideoId) {
                    setLinkPreview(`https://www.youtube.com/embed/${youtubeVideoId}`);
                } else {
                    setLinkPreview(null);
                }
            }
        }
    }, [foundPost]);

    useEffect(() => {
        if (textRef && textRef.current && textRef.current.offsetHeight > 100) {
            setTextToggle(true);
        }
    }, [textRef])

    if(!post || !foundPost) {return null;}

    const {
        user
    } = foundPost;

    const postAge = calculatePostAge(foundPost.createdAt);

    const handleImageClick = () => {
        if (!fullWidth) {
            openImageModal(true);
        }
    }

    const handleToggleComment = () => openCommentsModal(!commentsModalFlag);

    const handleUpdatePost = () => {
        openOptionsModal(false);
        openUpdateModal(true);
        setUpdatePostDataFlag(false);
    }

    const toggleText = () => {
        const expanded = textRef.current.classList.contains('expanded');
        if (expanded) {
            textRef.current.classList.remove('expanded');
        } else {
            textRef.current.classList.add('expanded');
        }
        setExpanded(!expanded);
    }

    const commentsModal = (
        <Modal
            handleClose={handleToggleComment}
            flag={commentsModalFlag}
        >
            <CommentsSection
                post={foundPost}
                inputFocus={true} 
                showList={true}
            />
        </Modal>
    );

    const imageModal = (
        <Modal
            handleClose={() => openImageModal(false)}
            flag={imageMopdalFlag}
        >
            <div className={ClassNames.POST_MEDIA_MODAL}>
                <Post post={foundPost} fullWidth={true}/>
            </div>
        </Modal>
    );

    const optionsModal = (
        <TooltipModal
            handleClose={() => openOptionsModal(false)}
            flag={optionsModalFlag}
        >
            <OptionsModal post={foundPost} handleUpdatePost={handleUpdatePost}/>
        </TooltipModal>
    );

    const updatePostModal = (
        <Modal
            handleClose={() => openUpdateModal(false)}
            flag={updateModalFlag}
        >
            <PostFormModal updatedPost={foundPost} />
        </Modal>
    );

    const feedComment = foundTopFeed && foundTopFeed.comment ? {
        ...foundTopFeed.comment,
    } : null;

    return (
        <React.Fragment>
            <div className={`${ClassNames.POST_WRAPPER}${fullWidth ? ' fullWidth' : ''}`}>
                <div className={ClassNames.POST_HEADER}>
                    <UserImage
                        id={user.id}
                        picUrl={user.profilePictureThumb}
                        username={user.username}
                        className={ClassNames.THUMBNAIL_IMG}
                    />
                    <div className="info">
                        <UserName name={user.name} id={user.id}/>
                        <span className="text">{postAge.key ? `${postAge.value} ${postAge.key} ago` : postAge.value}</span>
                    </div>
                    <div className="actions">
                        <Button className={ClassNames.INVISIBLE_BTN} onClick={() => openOptionsModal(true)}>
                            <MdMoreVert/>
                        </Button>
                        {optionsModalFlag && optionsModal}
                    </div>
                </div>
                <div className={ClassNames.POST_BODY}>
                    <div className={ClassNames.POST_BODY_TEXT}>
                        <p ref={textRef} className="text">
                            <span>{foundPost.content}</span>
                        </p>
                        <span className={`more ${textToggle ? 'active' : ''}`} onClick={toggleText}>
                            {expanded ? 'view less' : 'view more'}
                        </span>
                        {linkPreview && (
                            <div className="preview">
                                <iframe
                                    width="100%"
                                    height="300"
                                    src={linkPreview}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title="Link Preview"
                                    style={{ marginBottom: '10px' }}
                                />
                            </div>
                        )}
                    </div>
                    {foundPost.mediaUrl && 
                        <div className={ClassNames.POST_BODY_MULTIMEDIA} onClick={handleImageClick} style={{height: fullWidth ? '100%' : mediaHeight}} >
                            <div className="media">
                                <Media width={600} mediaUrl={foundPost.mediaUrl} handleHeightChange={h => setMediaHeight(h)} fullWidth={fullWidth}/>
                            </div>
                        </div>
                    }
                </div>
                <div className={ClassNames.POST_LIKE_SECTION}>
                    <ReactionsSection 
                        reactionList={foundPost.reactions}
                        reactionsNumber={foundPost.reactionsNumber}
                        commentsNumber={foundPost.commentsNumber}
                        openCommentsModal={handleToggleComment}
                    />
                </div>
                <div className={ClassNames.POST_BTNS}>
                    <PostButtons post={foundPost} handleAddComment={handleToggleComment}/>
                </div>
                <div className={ClassNames.POST_COMMENT_SECTION}>
                    {feedComment ? 
                        <FeedComment post={foundPost} comment={feedComment} openCommentsModal={handleToggleComment}/>
                    : null}
                </div>
            </div>
            {imageMopdalFlag && imageModal}
            {commentsModalFlag && commentsModal}
            {updateModalFlag && updatePostModal}
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    posts: selectPostsData(state),
    topFeeds: selectTopFeeds(state),
    updatePostData: selectApiState(state, POSTS_ROUTES.UPDATE_POST.name),
});

const mapDispatchToProps = dispatch => ({
    clearData: stateValues => dispatch(clearData(stateValues)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Post);
