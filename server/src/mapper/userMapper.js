import bcrypt from 'bcrypt';

export const reqDtoToUser = async req => {
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

export const userToResDto = user => {
    return {
        username: user.username,
        email: user.email,
        createAt: user.created_at,
        profilePictureUrl: user.profile_pic,
        name: user.displayed_name,
        description: user.description
    }
}