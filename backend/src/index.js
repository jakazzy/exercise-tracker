import 'dotenv/config';
// import cors from 'cors';
import bodyParser from 'body-parser';
import { sequelize} from './sequelize';
import express from 'express';
import { IndexRouter } from './controllers/v0/index.router';
// import { V0MODELS } from './controllers/v0/model.index'
// import users from './users.json'
// const _users = require('./users.json')


(async() => {
  try {
    // await sequelize.addModels(V0MODELS)
    await sequelize.sync({
      force: true,
      logging: console.log,
    });
  } catch (error){
    console.log('connection to database failed', error);
  }


  const app = express();
  const port = process.env.PORT || 8080;
  const restrictCors = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8100');
    res.header('Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
  };

  app.use(bodyParser.json());
  app.use(restrictCors);
  app.use('/api/v0', IndexRouter);

  app.get('/', async(req, res) => {
    res.send('api/v0');
  });

  app.listen(port, () => {
    console.log(`server running http://localhost:${ port }`);
    console.log('press CTRL+C to stop server');
  });
})();
