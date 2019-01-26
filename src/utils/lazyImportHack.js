export default function lazyImport(promise) {
  if (typeof window !== 'undefined') {
    // Browser
    return promise
  }

  // Node
  return promise.then(mod => mod.default)
}
