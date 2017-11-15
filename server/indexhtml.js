const path = require('path')
const fs = require('fs')

const filePath = path.resolve(__dirname, '..', 'build', 'index.html')

export const indexhtmlPromise = new Promise((resolve, reject) => {
  fs.readFile(filePath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('index.html read err', err)
      reject(err)
      process.exit(1)
    }
    resolve(htmlData)
  })
})
export const indexhtmlDirect = indexhtmlPromise.then(htmlData => {
  return htmlData
    .replace(
      /{{SSR}}/,
      '<img style="margin-left:50%" src="//cdn.vi0lation.de/img/viologo.png" alt="Vi0"/><noscript><div class="notification is-danger">JavaScript is required to run this App.</div></noscript>'
    )
    .replace(/DATA\s*=\s*{{.*?}}/g, '')
    .replace(/{{.*?}}/g, '')
})
