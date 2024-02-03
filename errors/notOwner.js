class NotOwner extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotOwnerError';
    this.statusCode = 403;
  }
}

module.exports = NotOwner;
