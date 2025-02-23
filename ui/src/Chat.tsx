import axios from 'axios'
import { app } from './App'
import { useEffect, useRef, useState } from 'react'

export const ChatPage = () => {
  const [message, setMessage] = useState('')
  const [isThinking, setIsThinking] = useState(false)

  const _message = useRef("")
  const _isThinking = useRef(false)

  const generate = async () => {
        setMessage('')
    _message.current = ''

    setIsThinking(_isThinking.current = true)

    const { data, error } = await app.generate.post({
      prompt: 'Why the sky is blue',
    })

    setIsThinking(_isThinking.current = true)

    if(error) {
      setIsThinking(_isThinking.current = false)
    }

    if(data)
      for await (const current of data) {
        _message.current = _message.current + current

        if (_isThinking.current) {
          if(_message.current.includes('</think>'))
            setIsThinking(_isThinking.current = false)
        } else {
          setMessage(prev => prev + current)
      }
      }
  }

  return (
    <div>
      {isThinking && <p className="animate-pulse">Thinking...</p>}
      <div className="flex w-full gap-x-2">
        <input type="text" className="border-2 border-slate-300 rounded-xl px-4 py-2 flex-1"/>
        <button className="px-2" onClick={generate}>Search</button>
      </div>
      <div className="w-full">
        <p>{message}</p>
      </div>
    </div>
  )
}

export default ChatPage