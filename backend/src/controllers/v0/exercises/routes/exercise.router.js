import { Router } from 'express'
import { Exercise } from '../models/Exercise'

const router = Router()

router.post('/', async(req, res)=>{
    const description = req.body.description;
    const duration = req.body.duration;
    

    if( !description){
        return res.status(422).send({message: "Description  cannot be null"})
    }
    if( !duration){
        return res.status(422).send({ message: "Duration  cannot be null"})
    }
    
   
    try{

    const newExercise = new Exercise({
        description,
        duration
    })
 
    let savedExercise;
    
        savedExercise = await newExercise.save()
    }catch(e){
        console.log('is this the error', e)
        throw e
    }
 
    return res.status(201).send({ user: savedExercise})
    
    })

    router.get('/', async(req, res)=>{
        const items = await FeedItem.findAndCountAll({order:[['id', 'DESC']]})
        return res.status(201).send(items)
})

 
    export const ExerciseRouter = router