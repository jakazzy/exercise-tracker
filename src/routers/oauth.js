import passport from 'passport'
import { initModels as models } from '../models'

export default (express)=>{
 const router = express.Router()

router.get(`/auth/facebook`,
 passport.authenticate('facebook', {authType: 'rerequest'}))


router.get(`/auth/facebook/callback`,
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    async(req, res) => {
        try {
            
            // const token = await models.User.generateJWT(req.user)
            console.log(req.user, "**********************************************************");
            return res
              .status(200)
              // .cookie('jwt', models.User.generateJWT(req.user), {
              //   httpOnly: true,
              // })
              // .send(JSON.parse(token))
              .send({message: "message"})
              .redirect('/')
        } catch (error) {
            console.log(error, "iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
            res.status(400).send({message: error.message})
        }
    }
  )
  return router
}