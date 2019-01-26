import 'izitoast/dist/css/iziToast.min.css'
import { isBrowser } from './env'

let toast

if (isBrowser) {
  toast = require('izitoast')
}

export default toast
