import { ChatMessage, ChatSession } from './types'

class ChatStore {
  private sessions: Map<string, ChatSession>

  constructor() {
    this.sessions = new Map()
  }

  createSession(sessionId: string): void {
    this.sessions.set(sessionId, {
      id: sessionId,
      messages: [],
    })
  }

  generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15)
  }

  addMessage(sessionId: string, role: ChatMessage['role'], content: string): void {
    const session = this.sessions.get(sessionId)
    if (!session) {
      throw new Error(`Session ${sessionId} not found`)
    }

    session.messages.push({
      role,
      content,
      timestamp: new Date(),
    })
  }

  getSession(sessionId: string): ChatSession | undefined {
    return this.sessions.get(sessionId)
  }

  getMessages(sessionId: string): ChatMessage[] {
    const session = this.sessions.get(sessionId)
    return session?.messages || []
  }
}

// Export a singleton instance
export const chatStore = new ChatStore()