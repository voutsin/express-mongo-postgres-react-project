import React, { useEffect, useState } from "react";
import Loader from "../../structure/Loader";
import { ClassNames } from "../../styles/classes";
import Post from "./Post";
import { connect } from "react-redux";
import { selectApiState } from "../../redux/reducers/apiReducer";
import { getUserPosts } from "../../redux/actions/actions";
import InfiniteScrolling from "./utils/InfiniteScrolling";
import { POSTS_ROUTES } from "../../config/apiRoutes";

const PostsList = props => {
    const [loading, setLoading] = useState(true);
    const [postsList, setPostsList] = useState(false);
    const [page, setPage] = useState({page: 1, pageSize: 5});
    const [postsChange, setPostsChange] = useState(false);

    const { userId, getUserPosts, posts, postsResponse } = props;

    useEffect(() => {
        if (userId) {
            getUserPosts(userId, page.page, page.pageSize);
        }
    }, [getUserPosts, userId, page]);

    useEffect(() => {
        if (JSON.stringify(posts) !== JSON.stringify(postsList)) {
            setLoading(false);
            setPostsList(posts);
            setPostsChange(true);
        }
    }, [postsList, posts]);

    const handleLoadMore = () => {
        const totalPages = postsResponse && postsResponse.data ? postsResponse.data.totalPages : 0;

        if (totalPages > page.page) {
            setPostsChange(false);
            const updatedPage = {
                ...page,
                page: page.page + 1,
            };
            setPage(updatedPage);
            getUserPosts(userId, updatedPage.page, updatedPage.pageSize);
        } 
    }

    if (loading) {
        return <Loader mini={true}/>
    }

    return (
        <React.Fragment>
            {postsList && postsList.length > 0 ?
                <div className={ClassNames.POSTS_LIST}>
                    <InfiniteScrolling
                        totalPages={postsResponse && postsResponse.data ? postsResponse.data.totalPages : 0}
                        currentPage={page ? page.page : 0}
                        handleLoadMore={handleLoadMore}
                        dataChange={postsChange}
                    >
                        {postsList && postsList.length > 0 && 
                            postsList.map((post, index) => {
                                return(
                                    <div className="post-item" key={`post-item-${index}${post.id}`}>
                                        <Post key={`post-${index}${post.id}`} post={post} />
                                    </div>
                                )
                            })
                        }
                    </InfiniteScrolling>
                </div>
                : <span className={ClassNames.NO_FEEDS}>No posts published yet.</span>
            }
        </React.Fragment>
    )
}

const mapStateToProps = state => ({
    posts: selectApiState(state, 'POSTS_LIST'),
    postsResponse: selectApiState(state, POSTS_ROUTES.FIND_USER_POSTS.name),
});

const mapDispatchToProps = dispatch => ({
    getUserPosts: (userId, page, pageSize) => dispatch(getUserPosts(userId, page, pageSize)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PostsList);