const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3001
const cors = require('cors')
const Pool = require('pg').Pool
const pool = new Pool({
  host: 'prezoo_db',
  port: 5432,
  user: 'prezoo_user',
  password: 'WMn2adK6fjHp48Pf8Q',
  database: 'testdata'
})
app.use(cors())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({ extended: true })
)
app.get('/', (request, response) => {
  response.json({ info: 'It works!' })
})
app.get('/test_query', (request, response) => {
  let q = 'SELECT * FROM data ORDER BY id ASC';
  console.log('test');
  pool.query(q, (error, results) => {
    if (error) { throw error }
    response.status(200).json(results.rows)
  })
})
app.listen(port, () => {
  console.log(`running on port ${port}.`)
})