// General response wrapper
const sendResponse = (res, statusCode, success, message, data = null) => {
  res.status(statusCode).json({
    success,
    message,
    ...(data && { data })
  });
};

// Success responses
const sendSuccess = (res, message, data = null, statusCode = 200) => {
  sendResponse(res, statusCode, true, message, data);
};

const sendCreated = (res, message, data) => {
  sendResponse(res, 201, true, message, data);
};

// Error responses
const sendError = (res, message, statusCode = 500) => {
  sendResponse(res, statusCode, false, message);
};

const sendBadRequest = (res, message) => {
  sendResponse(res, 400, false, message);
};

const sendUnauthorized = (res, message = 'Unauthorized') => {
  sendResponse(res, 401, false, message);
};

const sendForbidden = (res, message = 'Forbidden') => {
  sendResponse(res, 403, false, message);
};

const sendNotFound = (res, resource = 'Resource') => {
  sendResponse(res, 404, false, `${resource} not found`);
};

// Pagination helper
const getPaginationData = (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

// Paginated response
const sendPaginatedResponse = (res, data, total, page, limit, message = 'Success') => {
  res.status(200).json({
    success: true,
    message,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    },
    data
  });
};

module.exports = {
  sendResponse,
  sendSuccess,
  sendCreated,
  sendError,
  sendBadRequest,
  sendUnauthorized,
  sendForbidden,
  sendNotFound,
  getPaginationData,
  sendPaginatedResponse
};
