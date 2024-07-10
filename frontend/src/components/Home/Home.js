import React from 'react';
import RightSidebar from './RightSidebar';
import Feed from '../Feed/Feed';
import { ClassNames } from '../../styles/classes';
import AddNewPost from '../AddNewPost/AddNewPost';

const Home = props => {
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

export default Home;