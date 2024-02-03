const handleJsonParseError = (error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    const INVALID_DATA_CODE = 400;
    res.status(INVALID_DATA_CODE).json({ message: 'Invalid JSON' });
  } else {
    next();
  }
};

module.exports = handleJsonParseError;
