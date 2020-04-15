// Update with your config settings.

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      port: 15432,
      user: 'backend',
      password: 'backend'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
}
