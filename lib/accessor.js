const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')
const PDFParser = require('pdf2json')
const urlencode = require('urlencode')

exports.loadHtml = (url) => {
  return axios.get(url)
  .then(res => {
    const ctype = res.headers['content-type']
    if (!ctype.match('text/html')) {
      throw new Error('not html but ' + ctype)
    }
    const parsedHTML = cheerio.load(res.data)
    return parsedHTML
  })
}

exports.loadPDF = (url) => {
  return new Promise((resolve, reject) => {
    axios.get(url, {responseType: 'stream'})
    .then(res => {
      const ctype = res.headers['content-type']
      if (!ctype.match('application/pdf')) {
        return reject('not PDF but ' + ctype)
      }
      const pdfParser = new PDFParser()

      pdfParser.on('pdfParser_dataError', errData => reject(errData))
      pdfParser.on('pdfParser_dataReady', pdfData => {
        const parts = []
        let lastY = null
        let part = null
        pdfData.formImage.Pages.map(i => {
          i.Texts.map(j => {
            const t = urlencode.decode(j.R['0'].T)
            if (j.y === lastY) {
              part = part + t
            } else {
              if (part) {
                parts.push(part)
              }
              lastY = j.y
              part = t
            }
          })
        })
        resolve(parts)
      })

      res.data.pipe(pdfParser)
    })
    .catch(reject)
  })
}

exports.saveFile = (url, folder, fileName) => {
  return new Promise((resolve, reject) => {
    const req = request.get(url)
    if (fileName) {
      return req.pipe(fs.createWriteStream(path.join(folder, fileName)))
    } else {
      return req.on('response', (res) => {
        const fileName = res.headers['content-disposition'].match(/[^\']+$/)[0]
        const writeStream = fs.createWriteStream(path.join(folder, fileName))
        return req.pipe(writeStream)
      })
    }
  })
}
