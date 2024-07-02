import React from 'react';
import RightSidebar from './RightSidebar';
import Feed from '../Feed/Feed';
import { ClassNames } from '../../styles/classes';

const Home = props => {
    // TODO: add component to add post
    return (
        <React.Fragment>
            <div className={ClassNames.HOME_LIST}>
                <Feed/>
            </div>
            <RightSidebar/>
        </React.Fragment>
    )
}

export default Home;