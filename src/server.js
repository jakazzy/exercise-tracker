import 'dotenv/config';
import cors from 'cors'
import bodyParser from 'body-parser';
import DB from './config/sequelize';
import express from 'express';
import routers from './routers';
import {uninitModels, initModels} from './models'
import passport from 'passport'


(async() => {
  try {
    uninitModels.forEach(({name, init, association}) => {  
      initModels[name] = init(DB.sequelize, DB.Model, DB.DataTypes)  
    })

    Object.keys(initModels).forEach(modelName => {
      if (initModels[modelName].associate){
        initModels[modelName].associate(initModels)
      }
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
  

  app.use(cors());
  app.use(bodyParser.json());
  app.use(passport.initialize())
  // app.use(passport.session());
  app.use('/api/v1', routers.oauthRouter(express));
  app.use('/api/v1', routers.v1Router(express));
  
  
  // Home
  app.get('/', (req, res) => {
    res.status(200).send({message: 'Health ok'})
  })

  // route to handle errors
  app.use((req, res, next) => {
    res.status(404).send({message: `The request: ${req.path} cannot be found` })
  })
 

  app.listen(port, () => {
    console.log(`server running on Port: ${ port }`);
    console.log('press CTRL+C to stop server');
  });
})();
