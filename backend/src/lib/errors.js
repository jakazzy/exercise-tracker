export class RecordNotFoundError extends Error{
  constructor(message){
    super(message)
    this.name = 'RecordNotFoundError'
    this.statusCode = 404
  }
}
