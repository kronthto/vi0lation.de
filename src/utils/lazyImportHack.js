import { isBrowser } from './env'

export default function lazyImport(promise) {
  if (isBrowser) {
    // Browser
    return promise
  }

  // Node
  return promise.then(mod => mod.default)
}
