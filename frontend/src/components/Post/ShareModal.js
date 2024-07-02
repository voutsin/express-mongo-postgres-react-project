import React, { useEffect, useRef, useState } from 'react';
import { ClassNames } from '../../styles/classes';
import { Button } from '../../structure/Form/Form';
import { MdLink } from 'react-icons/md';
import FriendsColumn from '../Home/FriendsColumn';
import { buildUrl } from '../../common/utils';
import { BASE_URL } from '../../config/apiRoutes';
import { ROUTES } from '../../config/routes';

const ShareModal = props => {
    const sendToChatRef = useRef(null);
    const [copied, setCopied] = useState(null);

    useEffect(() => {
        const divHeight = sendToChatRef.current.offsetHeight;
        if (divHeight > 366) {
            sendToChatRef.current.style.overflowY = 'scroll';
        }
    }, [sendToChatRef]);

    const createPostLink = post => {
        return buildUrl(`${BASE_URL}${ROUTES.POST.path}`, { id: post.id })
    }

    const handleCopyLink = () => {
        const link = createPostLink(props.post);
        navigator.clipboard.writeText(link);
        setCopied(link);
    }

    return (
        <React.Fragment>
            <div className={ClassNames.SHARE_MODAL_WRAPPER}>
                <div className={ClassNames.REPOST}></div>
                <div className={ClassNames.SEND_TO_CHAT} ref={sendToChatRef}>
                    <FriendsColumn postLink={copied} shareModal={true} />
                </div>
                <div className={ClassNames.ACTION_BTNS}>
                    <div>
                        <Button className={'btn'} onClick={handleCopyLink}>
                            <span className='icon'><MdLink/></span>
                            <span className='text'>{copied ? 'Copied!' : 'Copy Link'}</span>
                        </Button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default ShareModal;
