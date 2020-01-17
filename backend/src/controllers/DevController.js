const axios = require('axios')
const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArray')
const { findConnections, sendMessage } = require('../websocket')

module.exports = {
  async index(req, res) {
    const devs = await Dev.find()

    return res.json(devs)
  },

  async store(req, res) {
    const { github_username, techs, longitude, latitude } = req.body

    let dev = await Dev.findOne({ github_username })

    if (!dev) {
      const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`)

      const { name = login, avatar_url, bio } = apiResponse.data

      const techsArray = parseStringAsArray(techs)

      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      }

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location,
      })

      // Filtrar as conexões que estao ha no maximo 10km de distancia
      // e que o novo dev tenha pelo menos uma das tecnologias filtradas.
      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsArray,
      )

      sendMessage(sendSocketMessageTo, 'new-dev', dev)
    }

    return res.json(dev)
  },


  async update(req, res) { // name, avatar, bio, techs
    const { github_username } = req.params
    const { techs, longitude, latitude, bio, avatar_url, name } = req.body

    const dev = await Dev.findOne({ github_username })

    if (!dev) {
      return res.json({ error: 'User not found !' })
    }

    const techsArray = parseStringAsArray(techs)

    const location = {
      type: 'Point',
      coordinates: [longitude, latitude]
    }

    const devUpdated = await dev.update({
      name,
      avatar_url,
      bio,
      location,
      techs: techsArray,
    })

    return res.json(devUpdated)
  },


  async destroy(req, res) {
    const { github_username } = req.params

    const dev = await Dev.findOne({ github_username })

    if (!dev) {
      return res.json({ error: 'User not found' })
    }

    await dev.delete()

    return res.json({ message: 'deleted' })
  }

}