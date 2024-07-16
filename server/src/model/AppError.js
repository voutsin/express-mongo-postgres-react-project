class AppError extends Error {
    constructor(message, statusCode) {
        const messageObj = message instanceof Object ? message : {errors: [message]};
        super(JSON.stringify(messageObj));
        this.statusCode = statusCode;
        this.status = statusCode;
        this.isOperational = true;
        
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;