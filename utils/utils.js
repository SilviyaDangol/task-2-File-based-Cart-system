// utils.js
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

function errorHandler(err, req, res, next) {
    res.status(500).json({
        error: err.message,
        success: false
    });
}

module.exports = { asyncHandler, errorHandler };