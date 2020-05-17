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
      const description = req.body.description;
      const duration = req.body.duration;
      if (!description){
        return res.status(422).send({message: 'Description  cannot be null'});
      }
      if (!duration){
        return res.status(422).send({ message: 'Duration  cannot be null'});
      }
        
      
      const newExercise = new model.Exercise({
        description,
        duration,
      });
      
      let savedExercise = await newExercise.save();
      return res.status(201).send({ user: savedExercise});
    } catch (e){
      res.status(400).send({ message: e.message})
    }
      
  },

  show: async(req, res) => {
    try {
      const {exercisesId } = req.params
      if (exercisesId){
        const id = parseInt(exercisesId, 10)
        const exercise = await model.Exercise.findByPk(id)
        res.status(200).send({ message: 'successful response', exercise })
      }
      res.status(400).send({message: 'exercises does not exist'})
    } catch (error) {
      res.status(404).send({message: error.message}) 
    }
  },

  update: async(req, res) => {
    try {
      const { exercisesId} = req.params
      if (exercisesId){
        const id = parseInt(exercisesId, 10)
        await model.Exercise.update(req.body, {where: {id}})
        res.status(200).send({message: 'exercise updated successfully'})
      }

      res.status(400).send({message: 'exercises does not exist'}) 
    } catch (error) {
      res.status(400).send({message: error.message})
    }   
  },
  // show
  // update
  // destroy


}
