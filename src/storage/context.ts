import { createContext } from 'react'

interface Task {
  id: string
  title: string
}

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
