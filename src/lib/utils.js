import { initModels as model } from '../models';

export const getUserId = async (token) => {
  //   const token = req.cookies['access_token'];
  try {
    const payload = await model.User.verifyJWT(token);
    const id = payload.id;
    return id;
  } catch (error) {
    console.log(error, 'i think i see you');
    return error;
  }
};
