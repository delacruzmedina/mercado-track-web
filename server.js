const express = require('express')
const compression = require('compression')

const app = express()
const port = 8088

app.use(compression())
app.use(express.static('./dist'))

app.get('/mtrack_promo_large.png', (req, res) => {
  res.sendFile('mtrack_promo_large.png', { root: './dist' })
})

app.get('/mtrack_promo_small.png', (req, res) => {
  res.sendFile('mtrack_promo_small.png', { root: './dist' })
})

app.get('/mtrack_logo.png', (req, res) => {
  res.sendFile('mtrack_logo.png', { root: './dist' })
})

app.get('*', (req, res) => {
  res.sendFile('index.html', { root: './dist' })
})

app.listen(port)

console.log(`Port: ${port}`)
