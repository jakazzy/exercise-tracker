import Joi from 'joi'

export default {
    validateBody: (schema)=>{
        return(req, res, next)=>{
            const result = schema.validate(req.body)
            if(result.error){
                return res.status(400).send({ message: result.error})
            }
            if(!req.value){ req.value={}}
            req.value['body']=result.value
            next()
        }
    },

    schemas: {
        authSchema: Joi.object().keys({
            username: Joi.string().min(6),
            email: Joi.string().email().required(),
            hashedpassword: Joi.string().min(8).required()
        }),
        eactvateSchema: Joi.object().keys({  
            email: Joi.string().email().required(),
           
        })
    } 
}