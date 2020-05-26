import { initModels as model } from '../../models'
import { RecordNotFoundError } from './../../lib/errors'


const setUser = id => {
  // eslint-disable-next-line no-undef
  return new Promise(async(resolve, reject) => {
    const user = await model.User.findByPk(id)   
    return user ? 
      resolve(user) : reject(new RecordNotFoundError('User not found.'))
  })
}
export default {

  index: async(req, res) => {
    try {
      const { id } = req.params
      const userId = parseInt(id, 10)
      const user = await setUser(userId)
      const items = await user.getExercises() 

      res.status(200).send(items);  
      
    } catch (error) {
      res.status(404).send({message: error.message})
    } 
  },

  create: async(req, res) => {
    try {
      const { id } = req.params
      const userId = parseInt(id, 10)
      const user = await setUser(userId)
      const description = req.body.description;
      const duration = req.body.duration;
      const errors = []

      if (!description){
        errors.push({message: 'Description  cannot be empty'});
      }

      if (!duration){
        errors.push({ message: 'Duration  cannot be empty'});
      }

      if (errors.length){
        return res.status(422).json(errors)
      }
      
      let savedExercise = await user.createExercise(req.body)

      return res.status(201).send({ 
        message: 'successfully added', 
        exercise: savedExercise,
      });

    } catch (e){

      if (e.statusCode){
        res.status(e.statusCode).send({ message: e.message }) 
      } else {
        res.status(400).send({message: e.message})
       
      }
      
    }
      
  },

  show: async(req, res) => {
    try {
      const {id, exerciseId } = req.params

      if (!exerciseId || !id){
        return res.status(404).send({message: 'resource does not exist'})
      }
      
      const exercid = parseInt(exerciseId, 10)
      const userid = parseInt(id, 10)
      const user = await setUser(userid)
      const exercise = await user.getExercise({ id: exercid})

      res.status(200).send({ message: 'successful response', exercise })
      
    } catch (e) {
      if (e.statusCode){
        return res.status(e.statusCode).send({message: e.message}) 
      } else {
        res.status(400).send({message: e.message})
      } 
    }
  },

  update: async(req, res) => {
    try {
      const {id, exerciseId} = req.params
      if (!exerciseId || !id){
        return new RecordNotFoundError('Resource notfound')
      }
      const exercId = parseInt(exerciseId, 10)
      await model.Exercise.update(req.body, {where: {id: exercId}})

      res.status(200).send({message: 'exercise updated successfully'})   
    } catch (e) {
      if (e.statusCode){
        res.status(e.statusCode).send({message: e.message})
      } else {
        res.status(400).send({message: e.message}) 
      }
    }   
  },
 
  destroy: async(req, res) => {
    try {
      const { id, exerciseId } = req.params
      if (!exerciseId || !id){
        return new RecordNotFoundError('resource does not exist')
      }
      const exercid = parseInt(exerciseId, 10)
      await model.Exercise.destroy({where: {id: exercid}})

      res.status(200).send({message: 'exercise deleted successfully'})    
    } catch (e) {
      if (e.statusCode){
        res.status(e.statusCode).message({message: e.message})
      }
      res.status(400).send({message: e.message})
    }
   
  },
}
