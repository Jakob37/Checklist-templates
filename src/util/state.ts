function mutateStateAtIndex<T>(
  origState: T[],
  setState: (newState: T[]) => void,
  index: number,
  mutateState: (slice: T) => void,
) {
  const stateCopy = [...origState]
  const stateSlice = stateCopy[index]
  mutateState(stateSlice)
  setState(stateCopy)
}

function removeStateAtIndex<T>(
  origState: T[],
  setState: (newState: T[]) => void,
  index: number,
) {
  const stateCopy = [...origState]
  stateCopy.splice(index, 1)
  setState(stateCopy)
}

export { mutateStateAtIndex, removeStateAtIndex }
