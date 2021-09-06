export class ApiError extends Error {
    message: string = '';
    constructor(message: string){
      super(message);
      this.name = "ConstraintsValidationError";
    }
}