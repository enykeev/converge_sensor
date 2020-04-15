const express = require('express')

const knexfile = require('../knexfile')
const knex = require('knex')(knexfile.development)

knex.migrate.latest()

const router = express.Router()

router.get('/data', async (req, res) => {
  const { sensorId, since, until } = req.query

  const query = knex('measurements')
    .select()

  if (sensorId) {
    query.where({ sensorId })
  }

  if (since) {
    query.where('time', '>', since)
  }

  if (until) {
    query.where('time', '<=', until)
  }

  try {
    res.json(await query)
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
})

router.post('/data', async (req, res) => {
  const { sensorId, time, value } = req.body

  try {
    await knex('measurements').insert({ sensorId, time, value })
    res.status(204).end()
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
})

router.get('/aggregates', async (req, res) => {
  const { sensorId, since, until } = req.query

  const query = knex('measurements')
    .groupBy('sensorId', 'bucket')
    .orderBy('bucket', 'DESC')
    .select(knex.raw('"sensorId", time_bucket(10, time) as "bucket", AVG(value) as value_avg'))

  if (sensorId) {
    query.where({ sensorId })
  }

  if (since) {
    query.where('time', '>', since)
  }

  if (until) {
    query.where('time', '<=', until)
  }

  try {
    res.json(await query)
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
})

async function main () {
  const app = express()

  app.use(express.json())
  app.use(router)

  app.listen(3000, () => {
    console.log('Listening on http://localhost:3000')
  })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
