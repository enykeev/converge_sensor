const knexfile = require('../knexfile')
const knex = require('knex')(knexfile.development)

async function main () {
  setInterval(async () => {
    const measurements = [{
      sensorId: 'sensor1',
      signals: [{
        A: 20,
        B: 0.1 / Math.PI,
        C: 0,
        D: 20
      }, {
        A: 0.5,
        B: 10 / Math.PI,
        C: 0,
        D: 0
      }]
    }]
      .map(({ sensorId, signals }) => {
        const time = Math.round(+Date.now() / 1000)
        const value = signals.reduce((acc, { A, B, C, D }) => {
          return acc + A * Math.sin(B * (time - C)) + D
        }, 0)

        return { sensorId, time, value }
      })

    const model = await knex('measurements')
      .returning(['sensorId', 'time', 'value'])
      .insert(measurements)

    console.log(model)
  }, 1000)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
