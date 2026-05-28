const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'passengers_rf',
    port: 5432
})

module.exports = pool