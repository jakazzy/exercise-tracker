export class RecordNotFoundError extends Error{
  constructor(message){
    super(message)
    this.name = 'RecordNotFoundError'
    this.statusCode = 404
  }
}
export class ValidationError extends Error{
  constructor(message){
    super(message)
    this.name = 'ValidationError'
    this.statusCode = 422
  }
}

export const checkValidity = errors => {
  if (errors && errors.length){
    throw new ValidationError('Invalid data ' + errors.join(','))
  }
}
