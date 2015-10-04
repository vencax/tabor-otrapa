
request = require('request')
cheerio = require('cheerio')
fs = require('fs')
path = require('path')


exports.loadHtml = (url, cb) ->
  request url, (err, response, body) ->
    return cb(err) if err

    ctype = response.headers['content-type']
    return cb("not html but #{ctype}") if not ctype.match('text/html')

    parsedHTML = cheerio.load body

    return cb(null, parsedHTML)


exports.saveFile = (url, folder, fileName)->
  req = request.get(url)
  if fileName
    req.pipe(fs.createWriteStream(path.join(folder, fileName)))
  else
    req.on 'response', (res)->
      fileName = res.headers['content-disposition'].match(/[^\']+$/)[0]
      req.pipe(fs.createWriteStream(path.join(folder, fileName)))
