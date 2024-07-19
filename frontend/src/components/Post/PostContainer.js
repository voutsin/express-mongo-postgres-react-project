import React, { useEffect, useState } from "react";
import Post from "./Post";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import Loader from "../../structure/Loader";
import NotFound from "../../structure/NotFound";
import { selectApiState } from "../../redux/reducers/apiReducer";
import { getSinglePostData } from "../../redux/actions/actions";
import { ClassNames } from "../../styles/classes";
import Comments from "./Comments/Comments";

const PostContainer = props => {
    const [loading, setLoading] = useState(true);
    const [postCall, setPostCall] = useState(false);
    const { getPostData, postsList } = props;

    const params = useParams();
    
    useEffect(() => {
        if (params && params.id) {
            getPostData(params.id);
            setPostCall(true);
        }
    }, [getPostData, params]);

    useEffect(() => {
        if (postsList && postCall) {
            setLoading(false);
        }
    }, [postsList, postCall]);

    if (!params || !params.id) {
        return <NotFound text={'Post not found or something went wrong.'}/>
    }

    if (loading) {
        return <Loader mini={true}/>
    }

    const post = postsList && postsList.find(p => p.id === parseInt(params.id));

    return (
        <React.Fragment>
            <div className={ClassNames.SINGLE_POST_WRAPPER}>
                {post
                    ? <div className={ClassNames.POST_ITEM}>
                        <Post key={`single-post-${post.id}`} post={post}/>
                        <Comments
                            post={post}
                            inputFocus={true} 
                            showList={true}
                        />
                    </div>
                    : <NotFound text={'Post not found.'}/>
                }
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    postsList: selectApiState(state, 'POSTS_LIST'),
});

const mapDispatchToProps = dispatch => ({
    getPostData: postId => dispatch(getSinglePostData(postId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostContainer);