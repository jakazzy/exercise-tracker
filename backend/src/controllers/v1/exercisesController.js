import { initModels as model } from '../../models'

export default {

  index: async(req, res) => {
    const items = await model.Exercise.findAndCountAll({
      order: [['id', 'DESC']],
    });

    return res.status(200).send(items);
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
    const {id } = req.params
    if (id){
      let exercise = await model.Exercise.findByPk(id)
      res.status(200).send({ message: 'successful response', exercise })
    }
    res.status(404).send({message: 'User does not exist'})
    
  },

  update: async(req, res) => {
    // res.status()
  },
  // show
  // update
  // destroy


}
