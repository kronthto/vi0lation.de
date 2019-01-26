import 'izitoast/dist/css/iziToast.min.css'

let toast

if (typeof window !== 'undefined') {
  toast = require('izitoast')
}

export default toast
