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