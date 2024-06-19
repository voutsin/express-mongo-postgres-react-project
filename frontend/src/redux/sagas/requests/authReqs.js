import { BASE_URL } from "../../../config/apiRoutes.js";

export const request = payload => {
    const { routeObj, data, params } = payload
    const { route, type } = routeObj;

    const bodyData = params ? null : data;

    if (params) {
        return type(`${BASE_URL}${route}`, {
            headers: {
              "Content-Type": "application/json",
            },
            params: params ? data : null,
            withCredentials: true // Ensure cookies are included in the request
        });
    }

    return type(`${BASE_URL}${route}`, bodyData, {
        headers: {
          "Content-Type": "application/json",
        },
        params: null,
        withCredentials: true // Ensure cookies are included in the request
    });
}

export const multiPartRequest = payload => {
  const { routeObj, data } = payload
  const { route, type } = routeObj;

  return type(`${BASE_URL}${route}`, data, {
      headers: {
        "Content-Type": 'multipart/form-data',
      },
      withCredentials: true // Ensure cookies are included in the request
  });
}