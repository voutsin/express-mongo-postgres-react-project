import React, { useEffect } from 'react';
import RightSidebar from './RightSidebar';
import Feed from '../Feed/Feed';
import { ClassNames } from '../../styles/classes';
import AddNewPost from '../AddNewPost/AddNewPost';
import { connect } from 'react-redux';
import { clearData } from '../../redux/actions/actions';
import { FEED_ROUTES } from '../../config/apiRoutes';

const Home = props => {

    useEffect(() => {
        return () => {
            props.clearData([
                FEED_ROUTES.GET_FEED.name,
                'POSTS_LIST',
                'COMMENTS_LIST'
            ]);
        };
    }, []);

    return (
        <React.Fragment>
            <div className={ClassNames.HOME_LIST}>
                <AddNewPost/>
                <Feed/>
            </div>
            <RightSidebar/>
        </React.Fragment>
    )
}

const mapDispatchToProps = dispatch => ({
    clearData: values => dispatch(clearData(values)),
});

export default connect(null, mapDispatchToProps)(Home);