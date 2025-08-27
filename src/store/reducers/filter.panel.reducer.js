// UI-only state for the search filter (which cell is open, etc.)
export const SET_ACTIVE_FILTER_CELL = 'SET_ACTIVE_FILTER_CELL'
export const CLEAR_ACTIVE_FILTER_CELL = 'CLEAR_ACTIVE_FILTER_CELL'

const initialState = {
  // null | 'where' | 'checkin' | 'checkout' | 'who'
  activeFilterCell: null,
}

export function FilterPanelReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ACTIVE_FILTER_CELL:
      return { ...state, activeFilterCell: action.cellKey }
    case CLEAR_ACTIVE_FILTER_CELL:
      return { ...state, activeFilterCell: null }
    default:
      return state
  }
}

// action creators
export const setActiveFilterCell = (cellKey) => ({ type: SET_ACTIVE_FILTER_CELL, cellKey })
export const clearActiveFilterCell = () => ({ type: CLEAR_ACTIVE_FILTER_CELL })
