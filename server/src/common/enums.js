
export const getEnumByValue = (enumValue, value) => {
    return Object.keys(enumValue).find(key => enumValue[key] === value);
}

export const FriendStatus = {
    REQUESTED: '1',
    PENDING: '2',
    ACCEPTED: '3',
    BLOCKED: '4'
}