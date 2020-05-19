import { initModels as model } from '../../models'

export default {

  index: async(req, res) => {
    try {
      const items = await model.Exercise.findAndCountAll({
        order: [['id', 'DESC']],
      })
      
      res.status(200).send(items);  
    } catch (error) {
      res.status(404).send({message: error.message})
    }
   
  },

  create: async(req, res) => {
    try {
      const {id} = req.params
      const userId = parseInt(id, 10)
      const user = await model.User.findByPk(userId)

      if (!user){
        res.status(404).send({message: 'User not found'})
      }
     
      const description = req.body.description;
      const duration = req.body.duration;
      if (!description){
        return res.status(422).send({message: 'Description  cannot be null'});
      }
      if (!duration){
        return res.status(422).send({ message: 'Duration  cannot be null'});
      }
        
      let savedExercise = await user.createExercise(req.body)
      return res.status(201).send({ 
        message: 'successfully added', 
        exercise: savedExercise,
      });

    } catch (e){
      res.status(400).send({ message: e.message})
    }
      
  },

  show: async(req, res) => {
    try {
      const {id, exerciseId } = req.params
      if (!exerciseId && id){
        res.status(404).send({message: 'resource does not exist'})
      }
      
      const exercid = parseInt(exerciseId, 10)
      const userid = parseInt(id, 10)
      const user = await model.User.findByPk(userid)
      const exercise = await user.getExercises({
        where: {id: exercid},
      })
      res.status(200).send({ message: 'successful response', exercise })
    } catch (error) {
      res.status(404).send({message: error.message}) 
    }
  },

  update: async(req, res) => {
    try {
      const {id, exerciseId} = req.params

      if (!exerciseId && id){
        res.status(404).send({message: 'resource does not exist'}) 
      }
      const exercId = parseInt(exerciseId, 10)
      // const userId = parseInt(id, 10)
      // const user = await model.User.findByPk(userId)
      // let exercise = await user.getExercises({
      //   where: {id: exercId},
      // })
      await model.Exercise.update(req.body, {where: {id: exercId}})
      res.status(200).send({message: 'exercise updated successfully'})
      
    } catch (error) {
      res.status(400).send({message: error.message})
    }   
  },
 
  destroy: async(req, res) => {
    try {
      const { id, exerciseId } = req.params

      if (!exerciseId && id){
        res.status(404).send({message: 'resource does not exist'}) 
      }
      const exercid = parseInt(exerciseId, 10)
      await model.Exercise.destroy({where: {id: exercid}})
      res.status(200).send({message: 'exercise deleted successfully'})
      
    } catch (error) {
      res.status(400).send({message: error.message})
    }
   
  },


}
