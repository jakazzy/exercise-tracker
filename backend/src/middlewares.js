import * as jwt from 'jsonwebtoken'
import { config } from './config/config'

export const requireAuth = async(req, res, next) => {
  if (!req?.headers?.authorization){
    res.status(401).send({message: 'No authorization headers'})
  }
  
  // eslint-disable-next-line no-unused-vars
  const [_, token] = req.headers.authorization.split(' ')

  if (!token) res.status(403).send({ message: 'Token is not present'})
  
  return jwt.verify(token, config.dev.jwt.secret, (err, decoded) => {

    if (err){
      return res.status(401)
        .send({auth: false, message: 'Failed to authenticate'})
    }

    if (decoded.id !== parseInt(req.params.id, 10)){
      res.status(403).send({message: 'Forbidden'})
    }
    
    return next()
  })
}

export const restrictCors = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header(
    'Access-Control-Allow-Headers,Origin,X-Requested-With,Content-Type,' +
    'Accept,Authorization'
  );
  next();
};

