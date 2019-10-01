const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const consola = require('consola')

router
  .get('/download/:filename', function(req, res) {
    consola.info('request download file' + req.params.originalname + '.flac')
    fs.readFile(
      path.resolve('converted', req.params.originalname),
      (err, data) => {
        if (err) throw err
        res.writeHead(200, { 'Content-Type': 'audio/flac' })
        res.end(data)
      }
    )
  })
  .get('/test', function(req, res) {
    consola.log('test')
    res.send('test')
  })

module.exports = router
