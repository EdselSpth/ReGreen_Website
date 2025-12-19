const success = (res, statusCode, data, message = "Success") => {
    return res.status(statusCode).json({
        status: "success",
        message: message,
        data: data,
    });
};

const error = (res, statusCode, message = "Internal Server Error") => {
    return res.status(statusCode).json({
        status: "error",
        message: message,
        data: null,
    });
};

module.exports = { success, error };