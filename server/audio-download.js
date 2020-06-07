const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const consola = require('consola')

router
  .get('/download/:filename', function(req, res) {
    consola.info('request download file' + req.params.filename + '.flac')
    res.download(
      path.resolve(__dirname, 'converted', req.params.filename),
      req.params.filename,
      function(err) {
        if (err) {
          consola.err(err)
          res.send('file not found')
        }
      }
    )
    // fs.readFile(
    //   path.resolve('converted', req.params.originalname),
    //   (err, data) => {
    //     if (err) throw err
    //     res.writeHead(200, { 'Content-Type': 'audio/flac' })
    //     res.end(data)
    //   }
    // )
  })
  .get('/download/test/', function(req, res) {
    consola.log('test')
    fs.readFile(path.resolve('uploads', 'upload_test.txt'), (err, data) => {
      if (err) throw err
      res.writeHead(200, { 'Content-Type': 'text' })
      res.end(data)
    })
  })

module.exports = router
