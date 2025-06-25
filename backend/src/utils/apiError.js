export default class ApiError extends Error {
  constructor(
    status = 500,
    message = "Internal Server Error",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.status = status;
    this.message = message;
    this.errors = errors;
    this.data = null;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      status: this.status,
      success: this.success,
      message: this.message,
      errors: this.errors,
      data: this.data,
    };
  }
}
