import * as jwt from 'jsonwebtoken'
import { config } from './config/config'

export const requireAuth = async(req, res, next) => {
  try {
    if (!req?.headers?.authorization){
      res.status(401).send({message: 'No authorization headers'})
      return
    }
    
    // eslint-disable-next-line no-unused-vars
    const [_, token] = req.headers.authorization.split(' ')
  
    if (!token){
      return res.status(403).send({ message: 'Token is not present'})
    
    }
  
    const decoded = await jwt.verify(token, config.dev.jwt.secret) 
    if (decoded.id !== parseInt(req.params.id, 10)){
      return res.status(403).send({message: 'Forbidden'})  
     
    } 
    next()

 
  } catch (error) {
    res.status(403).json(error)
  }
}

// export const restrictCors = (req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
//   res.header(
//     'Access-Control-Allow-Headers,Origin,X-Requested-With,Content-Type,' +
//     'Accept,Authorization'
//   );
//   next();
// };

