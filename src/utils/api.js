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

export function getCurrentTS() {
  return new Date().getTime()
}
