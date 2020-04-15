exports.up = (knex) => {
  return knex.schema
    .createTable('measurements', t => {
      t.string('sensorId')
      t.integer('time')
      t.float('value')

      t.primary(['sensorId', 'time'])
    })
    .raw("SELECT create_hypertable('measurements', 'time', chunk_time_interval => 24*60*60)")
}

exports.down = (knex) => {
  return knex.schema
    .dropTable('measurements')
}
