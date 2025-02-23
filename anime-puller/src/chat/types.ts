export interface ChatMessage {
  role: 'human' | 'assistant'
  content: string
  timestamp: Date
}

export interface ChatSession {
  id: string
  messages: ChatMessage[]
}