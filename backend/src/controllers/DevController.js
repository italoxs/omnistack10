const axios = require('axios')
const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArray')

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
    }

    return res.json(dev)
  },

  /*
  async update(req, res) { // name, avatar, bio, techs
    const { github_username } = req.params
    const dev = await Dev.findOne({github_username})
    const { techs, longitude, latitude, ...rest } = req.body

    rest.github_username = github_username

    if (techs)
      let techsArray = parseStringAsArray(techs)
      const devUpdate =  await Dev.updateOne({ github_username }, {
        location
      })

    return res.json({dev})
  },
  */
  /*
  async destroy(req, res) {
    const { id } = req.params

    await Dev.findByIdAndDelete(id)
    return res.status(200).json({ message: 'Success! User deleted!' })
  }
  */
}