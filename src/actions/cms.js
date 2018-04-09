import { REQUEST, RECEIVE } from '../types/cms'
import { CALL_API } from '../middleware/api'
import { isCurrentlyFetching, getCurrentTS } from '../utils/api'

const cmsTtl = 21600000 // 6h

function fetchCms(page) {
  return {
    [CALL_API]: {
      endpoint: 'cms/' + page,
      types: [REQUEST, RECEIVE]
    },
    page
  }
}

function shouldFetchCms(page, state) {
  const cmsState = state.cms

  const pageRequest = cmsState.requests[page]

  if (!pageRequest) return true

  if (isCurrentlyFetching(pageRequest)) return false

  // Should we check the actual data field?

  const { receivedAt } = pageRequest
  return receivedAt && receivedAt + cmsTtl <= getCurrentTS()
}

export function fetchCmsIfNeeded(page) {
  return (dispatch, getState) => {
    if (shouldFetchCms(page, getState())) {
      return dispatch(fetchCms(page))
    }
  }
}
