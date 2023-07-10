import { createContext } from 'react'

const StorageContext = createContext<{
  entries: Task[]
  saveEntries: (entries: Task[]) => void
}>({
  entries: [],
  saveEntries: _entries => {
    console.error('This placeholder should not be called')
  },
})

export { StorageContext }
