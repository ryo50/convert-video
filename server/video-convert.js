const express = require('express')
const router = express.Router()
const _fs = require('fs')
const fs = require('fs').promises
const multer = require('multer')
const ffmpeg = require('fluent-ffmpeg')
const path = require('path')
const consola = require('consola')
const nanoid = require('nanoid')

//ファイルの保存先を設定
const uploadFolder = path.resolve(__dirname, 'uploads')
const convertFolder = path.resolve(__dirname, 'converted')

const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, uploadFolder)
  },
  filename: function(req, file, callback) {
    callback(null, nanoid())
  }
})

function convert(inputFilename) {
  const inputFilePath = path.resolve(uploadFolder, inputFilename)
  const outputFileName = `${inputFilename}.flac`
  const outputFilePath = path.resolve(convertFolder, outputFileName)
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
  consola.info(`proc => ${JSON.stringify(proc)} `)
  return outputFileName
}

function createUploadFolder(req, res, next) {
  fs.mkdir(uploadFolder, { recursive: true })
  fs.mkdir(convertFolder, { recursive: true })
  next()
}

function removeExtention(filename) {
  return path.basename(filename, path.extname(filename))
}

const uploadVideo = multer({ storage: storage }).single('source')

router.post('/convert', createUploadFolder, uploadVideo, function(req, res) {
  consola.info('start convert... : ' + JSON.stringify(req.file))
  const responseFileName = removeExtention(req.file.originalname) + '.flac'
  const resultFilename = convert(
    req.file.filename,
    removeExtention(req.file.originalname)
  )
  consola.info(resultFilename)
  consola.info('complete convert!')
  res.json({ fileName: resultFilename })
})

router.get('/test', function(req, res) {
  res.json({
    message: 'test'
  })
})

module.exports = router
