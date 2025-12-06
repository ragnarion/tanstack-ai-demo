export interface Chat {
  id: string
  title: string
  isPinned: boolean
  createdAt: Date
  updatedAt: Date
}

// Frontend Message type (used in components)
export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
}

// Database Message type (used in server functions)
export interface DBMessage extends Message {
  chatId: string
}

export interface SearchResult {
  chatId: string
  chatTitle: string
  matchedContent: string | null
}

export interface StreamChunk {
  type: 'content' | 'error'
  content: string
}
