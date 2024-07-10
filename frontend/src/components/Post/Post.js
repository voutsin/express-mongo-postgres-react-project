import React, { useEffect, useState } from "react";
import UserImage from "../../structure/User/UserImage";
import { ClassNames } from "../../styles/classes";
import UserName from "../../structure/User/UserName";
import { Media, calculatePostAge, extractUrls, getYoutubeVideoId } from "../../common/utils";
import Modal from "../../structure/Modal";
import ReactionsSection from "./Reactions/Reactions";
import PostButtons from "./PostButtons";
import { connect } from "react-redux";
import { selectPostsData, selectTopFeeds } from "../../redux/reducers/apiReducer";
import FeedComment from "../Feed/FeedComment";
import CommentsSection from "../Post/Comments/Comments";

const Post = props => {
    const [imageMopdalFlag, openImageModal] = useState(false);
    const [mediaHeight, setMediaHeight] = useState('100%');
    const [commentsModalFlag, openCommentsModal] = useState(false);
    const [linkPreview, setLinkPreview] = useState(false);

    const {post, fullWidth, posts, topFeeds} = props;

    const foundPost = posts ? posts.find(p => p.id === post.id) : post;
    const foundTopFeed = topFeeds ? topFeeds.find(f => f.content.postId === post.id) : null;

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

    if(post == null) {return null;}

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
                </div>
                <div className={ClassNames.POST_BODY}>
                    <div className={ClassNames.POST_BODY_TEXT}>
                        <p>{foundPost.content}</p>
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
                        <div className={ClassNames.POST_BODY_MULTIMEDIA} onClick={handleImageClick} style={{height: mediaHeight}} >
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
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    posts: selectPostsData(state),
    topFeeds: selectTopFeeds(state),
})
export default connect(
    mapStateToProps
)(Post);
