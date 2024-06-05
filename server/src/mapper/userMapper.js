import bcrypt from 'bcrypt';
import { FriendStatus, getEnumByValue } from '../common/enums.js';

export const newUserReqDtoToUser = async req => {
    const saltRounds = 10;
    return {
        username: req.username,
        email: req.email,
        password_hash: await bcrypt.hash(req.password, saltRounds),
        created_at: new Date(),
        profile_pic: req.profilePictureUrl,
        displayed_name: req.name,
        description: req.description,
    }
}

export const updateUserReqDtoToUser = async req => {
    const saltRounds = 10;
    return {
        username: req.username,
        email: req.email,
        password_hash: await bcrypt.hash(req.password, saltRounds),
        profile_pic: req.profilePictureUrl,
        displayed_name: req.name,
        description: req.description,
    }
}

export const userToResDto = user => {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        createAt: user.created_at,
        profilePictureUrl: user.profile_pic,
        name: user.displayed_name,
        description: user.description,
        active: user.active,
    }
}

export const friendToResDto = friendship => {
    return {
        ...friendship,
        status: getEnumByValue(FriendStatus, friendship.status),
    }
}