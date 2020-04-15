const axios = require('axios').default
const expect = require('chai').expect

describe('API', () => {
  const client = axios.create({
    baseURL: 'http://localhost:3000'
  })

  describe('POST /data', () => {
    it('should return 204 on success', async () => {
      const data = {
        sensorId: 'deadbeef' + Math.random(),
        time: Math.round(+Date.now() / 1000),
        value: 99
      }
      const resp = await client.post('/data', data)
      expect(resp.status).to.equal(204)
    })

    it('should return 400 on missing sensorId', async () => {
      const data = {
        time: Math.round(+Date.now() / 1000),
        value: 99
      }
      const resp = await client.post('/data', data, { validateStatus: false })
      expect(resp.status).to.equal(400)
    })

    it('should return 400 on missing time', async () => {
      const data = {
        sensorId: 'deadbeef' + Math.random(),
        value: 99
      }
      const resp = await client.post('/data', data, { validateStatus: false })
      expect(resp.status).to.equal(400)
    })

    it('should return 400 if combination of sensorId and time is not unique', async () => {
      const data = {
        sensorId: 'deadbeef' + Math.random(),
        time: Math.round(+Date.now() / 1000),
        value: 99
      }
      await client.post('/data', data, { validateStatus: false })
      const resp = await client.post('/data', data, { validateStatus: false })
      expect(resp.status).to.equal(400)
    })
  })

  describe('GET /data', () => {
    it('should return list of measurements on success', async () => {
      const data = {
        sensorId: 'deadbeef' + Math.random(),
        time: Math.round(+Date.now() / 1000),
        value: 99
      }
      await client.post('/data', data)
      const resp = await client.get('/data')
      expect(resp.status).to.equal(200)
      expect(resp.data).to.deep.include(data)
    })

    it('should only return measurements with particular sensorId', async () => {
      const data = {
        sensorId: 'deadbeef' + Math.random(),
        time: Math.round(+Date.now() / 1000),
        value: 99
      }
      await client.post('/data', data)
      const resp = await client.get(`/data?sensorId=${data.sensorId}`)
      expect(resp.status).to.equal(200)
      expect(resp.data).to.deep.equal([data])
    })

    it('should only return measurements before until timestamp', async () => {
      const data = {
        sensorId: 'deadbeef' + Math.random(),
        time: 100,
        value: 99
      }
      await client.post('/data', data)
      const resp = await client.get(`/data?sensorId=${data.sensorId}&until=${data.time}`)
      expect(resp.data).to.deep.equal([data])
      const resp2 = await client.get(`/data?sensorId=${data.sensorId}&until=${data.time - 1}`)
      expect(resp2.data).to.deep.equal([])
    })

    it('should only return measurements after since timestamp', async () => {
      const data = {
        sensorId: 'deadbeef' + Math.random(),
        time: 100,
        value: 99
      }
      await client.post('/data', data)
      const resp = await client.get(`/data?sensorId=${data.sensorId}&since=${data.time}`)
      expect(resp.data).to.deep.equal([])
      const resp2 = await client.get(`/data?sensorId=${data.sensorId}&since=${data.time - 1}`)
      expect(resp2.data).to.deep.equal([data])
    })
  })
})
