const INVALID_DATA_CODE = 400;
const UNAUTHORIZED_CODE = 401;
const FORBIDDEN_CODE = 403;
const NOT_FOUND_CODE = 404;
const CONFLICT_CODE = 404;
const DEFAULT_ERROR_CODE = 500;

const showError = (statusCode, message, res) => {
  res.status(statusCode).json({ message });
};

const handleErrors = (message) => (req, res) => {
  const errorMappings = [
    { keyword: 'found', statusCode: NOT_FOUND_CODE },
    { keyword: 'Unauthorized', statusCode: UNAUTHORIZED_CODE },
    { keyword: 'Invalid', statusCode: INVALID_DATA_CODE },
    { keyword: 'Permission', statusCode: FORBIDDEN_CODE },
    { keyword: 'email', statusCode: CONFLICT_CODE },
    { keyword: 'На сервере произошла ошибка', statusCode: DEFAULT_ERROR_CODE },
  ];

  const errorMapping = errorMappings.find((mapping) => message.includes(mapping.keyword));

  if (errorMapping) {
    showError(errorMapping.statusCode, message, res);
  }
};

module.exports = handleErrors;
