const isFetchingTimeout = 10000 // 10s

export function isCurrentlyFetching(dataObject) {
  const { isFetching } = dataObject
  return isFetching && isFetching + isFetchingTimeout > getCurrentTS()
}

export function getCurrentTS() {
  return new Date().getTime()
}
