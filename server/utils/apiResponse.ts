class ApiResponse {
     statusCode: Number;
     data: Object;
     message: String;
     constructor(statusCode: Number, data: Object, message: string = "Success"){
          this.statusCode = statusCode;
          this.data = data;
          this.message = message;
     }
}

export default ApiResponse;