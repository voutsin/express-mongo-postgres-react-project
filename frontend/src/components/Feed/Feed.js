import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { selectApiState } from '../../redux/reducers/apiReducer';
import { FEED_ROUTES } from '../../config/apiRoutes';
import { getUserFeed } from '../../redux/actions/actions';
import { ClassNames } from '../../styles/classes';
import FeedComponent from './FeedComponent';
import Loader from '../../structure/Loader.js'
import InfiniteScrolling from '../Post/utils/InfiniteScrolling.js';

const Feed = props => {
    const [feedCall, setFeedCallFlag] = useState(false);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState({page: 1, pageSize: 10});
    const [feedData, setFeedData] = useState(null);
    const [feedChange, setFeedChange] = useState(false);

    const { feedResponse } = props;

    useEffect(() => {
        if (props.auth && props.auth.id && !feedCall) {
            props.getUserFeed(page);
            setFeedCallFlag(true);
        }

        if (props.feedResponse && props.feedResponse.success && loading) {
            setLoading(false);
            setFeedData(props.feedResponse.data.feeds)
        }

        if (!props.feedResponse || !props.feedResponse.success) {
            setLoading(true);
            setFeedData(null);
        }

    }, [props, feedCall, page, loading])

    useEffect(() => {
        const propsFeeds = feedResponse && feedResponse.data && feedResponse.data.feeds;
        if (propsFeeds && feedData && JSON.stringify(feedData) !== JSON.stringify(propsFeeds)) {
            setFeedData(propsFeeds);
            setFeedChange(true);
        }
    }, [feedResponse, feedData])

    const handleLoadMore = () => {
        const totalPages = feedResponse && feedResponse.data ? feedResponse.data.totalPages : 0;

        if (totalPages > page.page) {
            setFeedChange(false);
            const updatedPage = {
                ...page,
                page: page.page + 1,
            };
            setPage(updatedPage);
            props.getUserFeed(updatedPage);
        } 
    }

    if (loading) {
        return <Loader mini={true} />
    }

    return (
        <React.Fragment>
            <div className={ClassNames.FEED_WRAPPER}>
                {feedData && feedData.length > 0 
                ? <div className={ClassNames.FEED_LIST}>
                        <InfiniteScrolling
                            totalPages={feedResponse && feedResponse.data ? feedResponse.data.totalPages : 0}
                            currentPage={page ? page.page : 0}
                            handleLoadMore={handleLoadMore}
                            dataChange={feedChange}
                        >
                            {feedData.map((feed, index) => {
                                return (
                                    <FeedComponent 
                                        key={`feed-${index}${feed.post && feed.post.id}`} 
                                        feed={feed}
                                    />
                                )
                            })}
                        </InfiniteScrolling>
                    </div>
                : <span className={ClassNames.NO_FEEDS}>No friend activity yet.</span>}
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    feedResponse: selectApiState(state, FEED_ROUTES.GET_FEED.name),
});

const mapDispatchToProps = (dispatch) => ({
    getUserFeed: data => dispatch(getUserFeed(data)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Feed);