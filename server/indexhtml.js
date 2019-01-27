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
      '<noscript><div class="notification is-danger">JavaScript is required to run this App.</div></noscript><div id="preloader" style="width:100%;display:flex;height:100vh;justify-content:center"><div class="lds-dual-ring" style="align-self:center"></div></div>'
    )
    .replace(/DATA\s*=\s*{{.*?}}/g, '')
    .replace(/ASYNC_COMPONENTS_STATE\s*=\s*{{.*?}}/g, '')
    .replace(/{{.*?}}/g, '')
})
