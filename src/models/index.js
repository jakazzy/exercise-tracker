import Exercise from './Exercise';
import User from './User';


export const uninitModels = [
  { name: 'Exercise', init: Exercise, association: null},
  { name: 'User', init: User, association: 'Exercise'},
]

export const initModels = {}
