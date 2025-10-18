// Utility function to handle asynchronous route handlers in Express.js
const asyncHandler = (fn) => {
    return (req,res,next) => {
        Promise.resolve(fn(req,res,next)).catch((error) => next(error)
        )
    }
};

export {asyncHandler};