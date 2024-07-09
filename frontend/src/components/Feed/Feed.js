import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { selectApiState } from '../../redux/reducers/apiReducer';
import { FEED_ROUTES } from '../../config/apiRoutes';
import { getUserFeed } from '../../redux/actions/actions';
import { getDeepProp } from '../../common/utils';
import { ClassNames } from '../../styles/classes';
import FeedComponent from './FeedComponent';
import Loader from '../../structure/Loader.js'

const Feed = props => {
    const [feedCall, setFeedCallFlag] = useState(false);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState({page: 1, pageSize: 10});

    useEffect(() => {
        if (props.auth && props.auth.id && !feedCall) {
            props.getUserFeed(page);
            setFeedCallFlag(true);
        }

        if (props.feedResponse && props.feedResponse.success && loading) {
            setLoading(false);
        }

    }, [props, feedCall, page, loading])

    // TODO: PAGABLE FEED AND LOAD MORE
    const handleLoadMore = () => {
        setPage({
            ...page,
            page: page.page + 1,
        });
        props.getUserFeed(page);
    }

    const feeds = getDeepProp(props, 'feedResponse.data.feeds');

    if (loading) {
        return <Loader mini={true} />
    }

    return (
        <React.Fragment>
            <div className={ClassNames.FEED_WRAPPER}>
                {feeds && feeds.length > 0 
                ? <div className={ClassNames.FEED_LIST}>
                        {feeds.map((feed, index) => {
                            return (
                                <FeedComponent key={`feed-${index}`} feed={feed}/>
                            )
                        })}
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