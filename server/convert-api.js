const express = require('express')
const router = express.Router()
const fs = require('fs')
const multer = require('multer')
const ffmpeg = require('fluent-ffmpeg')
const path = require('path')
const consola = require('consola')

//ファイルの保存先を設定
const saveFolder = path.resolve(__dirname, 'uploads')
const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, saveFolder)
  },
  filename: function(req, file, callback) {
    callback(null, file.originalname)
  }
})

const uploadVideo = multer({ storage: storage }).single('source')

function convert(targetFilename) {
  const filePath = path.resolve(saveFolder, targetFilename)
  const destination = path.resolve('converted/' + targetFilename + '.flac')
  consola.info('filePath : ' + filePath)
  consola.info('savePath : ' + destination)
  const proc = ffmpeg(filePath)
    .audioCodec('flac')
    .audioChannels(2)
    .addOption('-ar', 44100)
    .format('flac')
    .on('end', function() {
      consola.info('file has been converted succesfully')
    })
    .on('error', function(err) {
      consola.info('an error happened: ' + err.message)
    })
    .save(destination)
  return proc
}

function checkUploadPath(req, res, next) {
  fs.exists(saveFolder, function(exists) {
    if (exists) {
      next()
    } else {
      fs.mkdir(saveFolder, function(err) {
        if (err) {
          consola.error('Error in folder creation')
          next()
        }
        next()
      })
    }
  })
}

router
  .post('/convert', checkUploadPath, uploadVideo, function(req, res) {
    consola.info(saveFolder)
    consola.info('start convert... : ' + req.file.originalname)
    convert(req.file.originalname)
    consola.info('complete convert!')
    res.send(req.file.originalname)
  })
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
