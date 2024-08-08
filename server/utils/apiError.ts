class ApiError extends Error {
     statusCode: Number;
     success: Boolean;
     constructor(message: string, statusCode: Number){
          super(message);
          this.statusCode = statusCode;
          this.success = false;
          Error.captureStackTrace(this,this.constructor);
     }
}

export default ApiError;