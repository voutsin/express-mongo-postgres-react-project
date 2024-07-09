import { useRef, useState } from "react";
import { BASE_URL } from "../config/apiRoutes";
import { Reactions } from "./enums";

export const removeEmptyFields = (object = {}) => {
    const res = Object.assign({}, object);

    if (object == null) {
        return res;
    }

    Object.keys(object).forEach(key => {
        if (object[key] == null || object[key] === '') {
            delete res[key];
        }
    });

    return res;
}

export const getDeepProp = (obj, path) => {
    const splittedPath = path.split('.');
    let target = obj;
    splittedPath.forEach(part => {
        if (target && target[part]) {
            target = target[part];
        } else {
            target = null;
        }
    });
    return target;
}

export const isObjectEmpty = (objectName) => {
    return (
      objectName &&
      Object.keys(objectName).length === 0 &&
      objectName.constructor === Object
    );
};

export const checkRequiredFields = (data, fieldsArray) => {
    let isValid = true;
    fieldsArray && data && 
    fieldsArray.forEach(field => {
        if (data[field] == null || data[field] === '') {
            isValid = false;
        }
    });

    return isValid;
}

export const findKey = (obj, value) => {
    return Object.keys(obj).find(key => obj[key] === value) || null;
}

// Function to replace dynamic segments in a URL
export const buildUrl = (template, params) => {
  return template.replace(/:([a-zA-Z]+)/g, (_, key) => params[key]);
};

export const calculatePostAge = (timestamp) => {
    const now = new Date(); // Current date and time
    const past = new Date(timestamp); // Given timestamp
    
    const diffInMs = now - past; // Difference in milliseconds
    
    // Convert milliseconds to readable format
    const seconds = Math.floor((diffInMs / 1000) % 60);
    const minutes = Math.floor((diffInMs / (1000 * 60)) % 60);
    const hours = Math.floor((diffInMs / (1000 * 60 * 60)) % 24);

    // Calculate years
    let years = now.getFullYear() - past.getFullYear();
    let months = now.getMonth() - past.getMonth();
    
    if (months < 0) {
      years--;
      months += 12; // Adjust for negative month difference
    }

    // Calculate the remaining difference for months, days, hours, minutes, and seconds
    let days = now.getDate() - past.getDate();
    if (days < 0) {
      // Get the last day of the previous month
      const lastDayOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      months--;
      days += lastDayOfPrevMonth;
      if (months < 0) {
        years--;
        months += 12;
      }
    }

    const reference = { 1: 'years', 2: 'months', 3: 'days', 4: 'hours', 5: 'minutes', 6: 'seconds' }
    const time = { 1: years, 2: months, 3: days, 4: hours, 5: minutes, 6: seconds };

    let age = {
        value: 'now',
        key: null
    };
    Object.keys(time).forEach(key => {
        if (time[key] > 0 && age.key == null) {
            age = {
                value: time[key],
                key: reference[key]
            }
        }
    });

    return age;
}

export const Video = props => {
    const {
        width, height, url
    } = props

    return (
        <video width={width} height={height} controls autoplay loop muted poster="https://via.placeholder.com/640x360">
            <source src={url} type="video/mp4"/>
            Your browser does not support the video tag.
        </video>
    )
}

export const Media = props => {
    const mediaRef = useRef(null);
    const [mediaHeight, setMediaHeight] = useState('auto');

    const { mediaUrl, width, handleHeightChange, fullWidth } = props;

    const mediaType = mediaUrl ? getMediaType(mediaUrl) : null;

    const handleImageLoad = () => {
        if (mediaRef.current && mediaType) {
            const height = mediaType === 'image' 
                ?  mediaRef.current.clientHeight
                : mediaRef.current.videoHeight;
            setMediaHeight(height);
            handleHeightChange(height);
        }
    };

    return (
        mediaType === 'image' 
            ? <img src={`${BASE_URL}/${mediaUrl}`} alt={''} width={fullWidth ? 'auto' : width} height={fullWidth ? 'auto' : mediaHeight} ref={mediaRef} onLoad={handleImageLoad}/> 
            : mediaType === 'video'
                ? <Video url={`${BASE_URL}/${mediaUrl}`} width={fullWidth ? 'auto' : width} height={fullWidth ? 'auto' : mediaHeight} ref={mediaRef} onLoadedMetadata={handleImageLoad}/>
                : null
    )
}

export const getMediaType = url => {
    const split = url.split('.');
    const suffix = split[split.length - 1].toLowerCase();
    const imageFormats = ['jpg', 'png'];
    const videoFormats = ['mp4'];

    return imageFormats.includes(suffix) ? 'image' : videoFormats.includes(suffix) ? 'video' : null;
}

export const hideDivWhenClickingOutside = ref => {
    window.addEventListener('mouseup', function(event){
          if(event.target !== ref.current && event.target.parentNode !== ref.current){
              ref.current.classList.remove('opened');
          }
    });
}

export const userHasReacted = (auth, obj) => {
    const reaction = auth && obj && obj.reactions.find(r => r.userId && r.userId === auth.id);
    return reaction;
}

export const getReplyParentComment = commentData => {
    if (commentData.isReply) {
        const reply = Object.assign({}, commentData);
        delete reply.replyComment;
        const parentComment = commentData.replyComment;
        return {
            ...parentComment,
            replies: parentComment.replies ? [
                ...parentComment.replies,
                reply
            ] : [reply]
        }
    } else return commentData;
}

export const groupedComments = comments => 
    comments.reduce((acc, comment) => {
        const { postId } = comment;
        if (!acc[postId]) {
            acc[postId] = [];
        }
        acc[postId].push(comment);
        return acc;
    }, {});

export const findCommentInCommentList = (comment, commentsList) => {
    if (!comment || !commentsList) {
        return null;
    }

    // Retrieve the comments for the given postId 
    const postComments = commentsList[comment.postId];
    if (!postComments) {
        return null; // No comments for the given postId
    }

    const foundComment = comment.isReply
        ? postComments.find(c => c.replies && c.replies.some(r => r.id === comment.id))
        : postComments.find(c => c.id === comment.id);
    
    return foundComment || null;
}

export const areSameObejcts = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

export const findPostInPostList = (post, postsList) => {
    if (!post || !postsList) {
        return null;
    }

    return postsList.find(p => p.id === post.id) || null;
}

export const organizeReactions = reactions => {
    const numberOfLikes = reactions.filter(reaction => reaction.reactionType === Reactions.LIKE).length;
    const numberOfLoves = reactions.filter(reaction => reaction.reactionType === Reactions.LOVE).length;
    const numberOfLaughs = reactions.filter(reaction => reaction.reactionType === Reactions.LAUGH).length;
    const numberOfWows = reactions.filter(reaction => reaction.reactionType === Reactions.WOW).length;
    const numberOfCries = reactions.filter(reaction => reaction.reactionType === Reactions.CRY).length;

    return {
        total: reactions.length,
        1: numberOfLikes, //like
        2: numberOfLoves, // love
        3: numberOfLaughs, // laugh
        4: numberOfWows, // wow
        5: numberOfCries, // cry
    }
}