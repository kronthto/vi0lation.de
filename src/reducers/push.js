const initialState = {
  events: []
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_EVENTS':
      return Object.assign({}, state, {
        events: action.events
      })
    default:
      return state
  }
}
