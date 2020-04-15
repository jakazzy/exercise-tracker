import 'dotenv/config';
// import cors from 'cors';
import express from 'express';
import { IndexRouter } from './controllers/v0/index.router'
import { V0MODELS } from './controllers/v0/model.index'


(async ()=>{
    await sequelize.addModels(V0MODELS)
    await sequelize.sync()

    const app = express()
    const port = process.env.PORT || 8080
    const restrictCors=(req, res, next)=>{
        res.header("Access-Control-Allow-Origin", "http://localhost:8100")
        res.header("Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, Accept, Authorization")
        next()
    }

    app.use(bodyParser.json())
    app.use(restrictCors)
    app.use('/api/v0', IndexRouter)

    app.get('/', async(req, res)=>{
        res.send("api/v0")
    })

    app.listen(port, ()=>{
        console.log( `server running http://localhost:${ port }` );
        console.log( `press CTRL+C to stop server` );
    })
})()