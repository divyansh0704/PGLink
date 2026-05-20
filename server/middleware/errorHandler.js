function errorHandler(err, req, res, next){
    let status = err.status || 500;
    let message = err.message || "Internal Server Error";

    if (err.name === "SequelizeValidationError" ){
        status = 400;
        message = err.errors.map(e=> e.message).join(", ");
    }
    if(err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError'){
        status = 401;
        message = 'Invalid or expired token';
    }

    console.error(`Error[${status}]`,err);
    res.status(status).json({
        error:message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    })

}

module.exports = errorHandler;