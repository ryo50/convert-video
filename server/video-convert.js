const express = require('express')
const router = express.Router()
const fs = require('fs')
const multer = require('multer')
const ffmpeg = require('fluent-ffmpeg')
const path = require('path')
const consola = require('consola')
const nanoid = require('nanoid')

//ファイルの保存先を設定
const saveFolder = path.resolve(__dirname, 'uploads')

const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, saveFolder)
  },
  filename: function(req, file, callback) {
    callback(null, nanoid())
  }
})

function convert(inputFilename, outputFilename) {
  const inputFilePath = path.resolve(saveFolder, inputFilename)
  const outputFilePath = path.resolve(
    __dirname,
    'converted',
    outputFilename + '.flac'
  )
  consola.info('targetPath : ' + inputFilePath)
  consola.info('savePath : ' + outputFilePath)
  const proc = ffmpeg(inputFilePath)
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
    .save(outputFilePath)
  return outputFilename
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

function removeExtention(filename) {
  return path.basename(filename, path.extname(filename))
}

const uploadVideo = multer({ storage: storage }).single('source')

router.post('/convert', checkUploadPath, uploadVideo, function(req, res) {
  consola.info('start convert... : ' + req.file.originalname)
  let resultFilename = convert(
    req.file.filename,
    removeExtention(req.file.originalname)
  )
  consola.info('complete convert!')
  res.send(resultFilename)
})

module.exports = router
