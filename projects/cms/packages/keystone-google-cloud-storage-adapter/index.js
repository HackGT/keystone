const debug = require('debug')('keystone-cloud-storage')
const storage = require('@google-cloud/storage')
const ensureCallback = require('keystone-storage-namefunctions/ensureCallback')
const nameFunctions = require('keystone-storage-namefunctions')
const pathlib = require('path')

const DEFAULT_OPTIONS = {
  keyFilename: process.env.CLOUD_STORAGE_KEY_FILENAME,
  generateFilename: nameFunctions.randomFilename,
  uniqueFilename: true
}

function CloudStorageAdapter (options, schema) {
  this.options = Object.assign({}, DEFAULT_OPTIONS, options.cloudStorage)

  this.client = storage(this.options)

  // if (options.keyFilename != null && !pathlib.isAbsolute(options.keyFilename)) {
  //   throw Error('Configuration error, incorrect keyfile')
  // }

  this.options.generateFilename = ensureCallback(this.options.generateFilename)

  return this
}

CloudStorageAdapter.compatibilityLevel = 1

CloudStorageAdapter.SCHEMA_TYPES = {
  filename: String,
  originalname: String,
  bucket: String,
	path: String,
  mimetype: String,
  url: String,
  etag: String,
}

CloudStorageAdapter.SCHEMA_FIELD_DEFAULTS = {
  filename: true,
  originalname: true,
  mimetype: true,
  url: true,
  bucket: false,
  path: false,
  etag: false,
}

CloudStorageAdapter.prototype._clientForFile = function (file) {
  if (file.bucket && file.bucket !== this.options.bucket) {
    const options = Object.assign({}, this.options, {
      bucket: file.bucket
    })
    return storage(options)
  } else {
    return this.client
  }
}

CloudStorageAdapter.prototype._resolveFilename = function (file) {
  return pathlib.posix.resolve(file.stream.path)
}

CloudStorageAdapter.prototype._resolveRemoteFilename = function (file) {
  const path = file.path || this.options.path || '/'
  return `${path}${file.filename}`
}

CloudStorageAdapter.prototype.save = async function (file, callback) {
  const self = this

  var saveData = await new Promise((resolve, reject) => this.options.generateFilename(file, 0, function (err, filename) {
    if (err) {
        console.log(err)
        reject(err)
        return
    }
    const localpath = self._resolveFilename(file)
    file.path = self.options.path
    if (self.options.uniqueFilename) {
      file.filename = filename
    } else {
      file.filename = file.originalname
    }
    const destpath = self._resolveRemoteFilename(file)

    const uploadOptions = Object.assign({}, self.options.uploadOptions, {
      destination: destpath
    })
    debug('Uploading file %s', file.filename)
    self.client
      .bucket(self.options.bucket)
      .upload(localpath, uploadOptions, function (err, response) {
        if (err) {
            console.log(err)
            return err
        }

        const metadata = response.metadata || {}

        const fileData = {
          id: file.id,
          filename: file.filename,
          size: metadata.size,
          mimetype: metadata.contentType,
          path: self.options.path,
          originalname: file.originalname,
          url: metadata.mediaLink,
          bucket: self.options.bucket,
          etag: metadata.etag,
          md5: metadata.md5Hash,
          storageClass: metadata.storageClass
        }

        debug('file upload successful')
        resolve(fileData)
    });
}));
return saveData;

}

CloudStorageAdapter.prototype.publicUrl = function (file) {
  return file.url
}

CloudStorageAdapter.prototype.delete = function (file, callback) {
  const fullpath = this._resolveRemoteFilename(file)
  console.log(file.bucket)
  this._clientForFile(file)
    .bucket(this.options.bucket)
    .file(fullpath)
    .delete(function (err) {
      if (err) {
          console.log(err)
          return err
      }
      return
    })
}

CloudStorageAdapter.prototype.fileExists = async function (filename, callback) {
  const fullpath = this._resolveRemoteFilename({
    filename: filename
  })
  return await new Promise((resolve, reject) => {
      this.client
      .bucket(this.options.bucket)
      .file(fullpath)
      .exists(function (err, exists) {
          if (err) {
              console.log(err)
              reject(err)
          }
          resolve(!exists)
      })
  })

}

module.exports = CloudStorageAdapter
