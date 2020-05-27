import 'dotenv/config';
import bodyParser from 'body-parser';
import DB from './config/sequelize';
import express from 'express';
import routers from './routers';
import {uninitModels, initModels} from './models'
import { restrictCors } from './middlewares'
// import { RecordNotFoundError} from './lib/errors'


(async() => {
  try {
    uninitModels.forEach(({name, init, association}) => {  
     
      if (!association){
        initModels[name] = init(DB.sequelize, DB.Model, DB.DataTypes) 
        return
      } 
      
      initModels[name] = init(
        DB.sequelize, 
        DB.Model, 
        DB.DataTypes, 
        initModels[association]) 
    })

   
    await DB.sequelize.sync({
      force: true,
      // logging: console.log,
    });
  } catch (error){
    console.log('connection to database failed', error);
  }


  const app = express();
  const port = process.env.PORT || 8080;
  

  app.use(bodyParser.json());
  app.use(restrictCors);
  app.use('/api/v1', routers.v1Router(express));
  
  // route to handle errors
  app.use((req, res, next) => {
    res.status(404).send({message: `The request: ${req.path} cannot be found` })
  })
 
  app.listen(port, () => {
    console.log(`server running http://localhost:${ port }`);
    console.log('press CTRL+C to stop server');
  });
})();
