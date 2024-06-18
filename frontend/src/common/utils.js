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
        if (target[part]) {
            target = target[part];
        }
    });
    return target;
}