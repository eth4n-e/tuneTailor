// function mocks the response returned from fetch
// allows for me to mimic fetch requests without having to make them
export const createMockSuccessResponse = (data, options = {}) => ({
    ok: true,
    status: 200,
    json: () => Promise.resolve(data),
    ...options
});

// mock response from fetch api when error has occurred in request
export const createMockErrorResponse = () => ({
    message: "Error fetching resource",
    status: 404,
});