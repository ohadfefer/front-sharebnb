import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  setActiveFilterCell as setActiveFilterCellAction,
  clearActiveFilterCell as clearActiveFilterCellAction,
} from "../store/reducers/filter.panel.reducer"

/**
 * useFieldControl
 * Manages which filter cell is active (where | checkin | checkout | who),
 * supports Enter-to-next, and optional outside-click-to-close.
 *
 * @param {string[]} fieldOrder - e.g. ["where", "checkin", "checkout", "who"]
 * @param {{ enableOutsideClickClose?: boolean }} options
 */


export function useFieldControl(fieldOrder, { enableOutsideClickClose = true } = {}) {
  const dispatch = useDispatch()

  // IMPORTANT: this selector key must match your combineReducers key
  const activeFilterCell = useSelector(
    (state) => state.filterPanelModule?.activeFilterCell ?? null
  )

  const pillElementRef = useRef(null)
  const popoverElementRef = useRef(null)

  function setActiveFilterCell(cellKey) {
    dispatch(setActiveFilterCellAction(cellKey))
  }
  function clearActiveFilterCell() {
    dispatch(clearActiveFilterCellAction())
  }

  function goToNextCell() {
    if (!activeFilterCell) return
    const currentIndex = fieldOrder.indexOf(activeFilterCell)
    if (currentIndex === -1) return
    const nextIndex = Math.min(currentIndex + 1, fieldOrder.length - 1)
    setActiveFilterCell(fieldOrder[nextIndex])
  }

  function getCellProps(cellKey) {
    const isActive = activeFilterCell === cellKey
    return {
      className: `cell ${cellKey} ${isActive ? "active" : ""}`,
      onMouseDown: () => {
        setActiveFilterCell(cellKey)
      },
      tabIndex: 0,
      onKeyDown: (keyboardEvent) => {
        if (keyboardEvent.key === "Enter") {
          keyboardEvent.preventDefault()
          goToNextCell()
        }
      },
    }
  }

  // Close when clicking outside the pill and the popover
  useEffect(() => {
    if (!enableOutsideClickClose) return

    function handleOutsideClick(mouseEvent) {
      const clickedInsidePill = pillElementRef.current?.contains(mouseEvent.target)
      const clickedInsidePopover = popoverElementRef.current?.contains(mouseEvent.target)
      if (!clickedInsidePill && !clickedInsidePopover) {
        clearActiveFilterCell()
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [enableOutsideClickClose])

  return {
    // state
    activeFilterCell,

    // actions
    setActiveFilterCell,
    clearActiveFilterCell,
    goToNextCell,

    // props helper for cells
    getCellProps,

    // refs for anchoring and outside-click detection
    pillElementRef,
    popoverElementRef,
  }
}
