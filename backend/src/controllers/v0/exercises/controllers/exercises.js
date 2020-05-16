import { Exercise } from './../../../../models/exercise-model/Exercise'

export default {
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
        
      
      const newExercise = new Exercise({
        description,
        duration,
      });
      
      let savedExercise = await newExercise.save();
      return res.status(201).send({ user: savedExercise});
    } catch (e){
      console.log('is this the error', e);
      throw e;
    }
      
  },

  getAll: async(req, res) => {
    const items = await Exercise.findAndCountAll({order: [['id', 'DESC']]});
    return res.status(201).send(items);
  },
}
