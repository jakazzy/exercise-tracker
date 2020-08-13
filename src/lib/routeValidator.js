import Joi from 'joi'

export default {
    validateBody: (schema)=>{
        return(req, res, next)=>{
            const result = schema.validate(req.body)
            console.log(result, 'whats causing this');
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
            email: Joi.string().email().required(),
            hashedpassword: Joi.string().required(),
            username: Joi.string().min(6).optional(),
            phonenumber: Joi.string().optional(),
            remember: Joi.boolean().optional()
        }),
        eactvateSchema: Joi.object().keys({  
            email: Joi.string().email().required(),
           
        })
    } 
}