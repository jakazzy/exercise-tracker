export class RecordNotFound extends Error{
  constructor(message){
    super(message)
    this.name = 'RecordNotFoundError'
    this.code = 404
  }
}
