const path = require('path')
const express = require('express')
const app = express()
const { PORT } = require('./config')
const cors = require('cors')
const morgan = require('morgan')

const networkRoutes = require(path.join(__dirname, '.', '/routes/networkRoutes'))

app.use(cors())
app.use(morgan('tiny'))
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({
    extended: false
  }))

app.listen(PORT, () => console.log('Connected to port ' + PORT))

app.use(networkRoutes)