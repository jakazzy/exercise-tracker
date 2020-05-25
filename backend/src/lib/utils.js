export const setUser = async(id, data, error) => {
  const user = await data.User.findByPk(id)
  return user || error('User not found')
}


