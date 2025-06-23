const formatResponse = (res, status, message, data) => res.status(status).json({
    message, result: data, status
});

module.exports = {
    formatResponse
};