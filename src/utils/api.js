const isFetchingTimeout = 10000 // 10s

export function isCurrentlyFetching(dataObject) {
  const { isFetching } = dataObject
  return isFetching && isFetching + isFetchingTimeout > getCurrentTS()
}

export async function handleErrors(response) {
  if (!response.ok) {
    let err = new Error(response.statusText)
    err.response = response
    throw err
  }
  return response
}

export function throwIfErrorIsNot(error, codes) {
  const errorResponse = error.response
  if (!errorResponse || codes.indexOf(errorResponse.status) === -1) {
    throw error
  }
}

export function getCurrentTS() {
  return new Date().getTime()
}
