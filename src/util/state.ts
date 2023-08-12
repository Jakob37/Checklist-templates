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

export { mutateStateAtIndex }
