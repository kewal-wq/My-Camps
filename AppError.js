class AppError extends Error {
    constructor(message,error){
     super();
     this.message = message;
     this.error = error;
    }
}
module.exports = AppError;