import { app } from '../App'
import { useEffect, useRef, useState } from 'react'
import Markdown from 'react-markdown'
import { AI_PROVIDER } from '../const/llm'

export const GeneratePage = () => {
  // State for the user input prompt
  const [prompt, setPrompt] = useState('')
  // State for the generated response
  const [message, setMessage] = useState('')
  // State for thinking/loading status
  const [thinkMessage, setThinkMessage] = useState('')
  // State for tracking thinking/loading status
  const [isThinking, setIsThinking] = useState(false)
  // State for tracking the typing status
  const [isTyping, setIsTyping] = useState(false)

  const [provider, setPrompter] = useState(AI_PROVIDER.OLLAMA)


  const handleProviderChange = (newProvider: AI_PROVIDER) => {
    setPrompter(newProvider)
  }

  // Refs to handle streaming updates without re-renders
  const _message = useRef("")
  const _isThinking = useRef(false)
  const _thinkingTextDivRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    _thinkingTextDivRef.current?.scrollTo({
      behavior: 'smooth',
      top: _thinkingTextDivRef.current.scrollHeight,
    })
  }, [thinkMessage])

  const generateOllama = async () => {
    // Don't process empty prompts
    if (!prompt.trim()) return

    // Reset message and start thinking state
    setMessage('')
    setThinkMessage('')
    _message.current = ''
    setIsThinking(_isThinking.current = true)

    try {
      const { data, error } = await app.generate_ollama.post({
        prompt: prompt,
      })

      if (error) {
        throw error
      }

      // Process the response data
      if (data) {
        console.log('Starting generation...')
        for await (const current of data) {
          _message.current = _message.current + current

          if (_isThinking.current) {
            if(_message.current.includes('</think>'))
              setIsThinking(_isThinking.current = false)
              setThinkMessage(prev => prev + current)
            } else {
              setMessage(prev => prev + current)
          }
        }
      }
      console.log('Generation successful:', message)
    } catch (error) {
      console.error('Generation failed:', error)
      setMessage('Sorry, something went wrong. Please try again.')
    } finally {
      setIsThinking(_isThinking.current = false)
    }
  }


  const generateOpenAI = async () => {
    // Don't process empty prompts
    if (!prompt.trim()) return

    // Reset message and start thinking state
    setMessage('')
    _message.current = ''
    setIsThinking(_isThinking.current = true)

    try {
      const { data, error } = await app.generate_openai.post({
        prompt: prompt,
      })

      if (error) {
        throw error
      }

      // Process the response data
      if (data) {
        console.log('Starting generation...')
        for await (const current of data) {
          _message.current = _message.current + current

          if (current === '\n') {
            // console.log('Newline detected')
            try {
              const parsed = JSON.parse(`${_message.current.replace('data: ', '')}`)
              _message.current = ''

              if (parsed.choices.length > 0 && parsed.choices[0].delta?.content) {
                const content = parsed.choices[0].delta.content
                console.log('content:', content)
                // _message.current += content
                setMessage(prev => prev + content)
              }
            } catch (e) {
            }
          }
        }
      }
    } catch (error) {
      console.error('Generation failed:', error)
      setMessage('Sorry, something went wrong. Please try again.')
    } finally {
      setIsThinking(_isThinking.current = false)
    }
  }

  function generate() {
    if (provider === AI_PROVIDER.OLLAMA) {
      generateOllama()
    } else if (provider === AI_PROVIDER.OPENAI) {
      generateOpenAI()
    } else {
      alert('Provider not supported')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 h-full flex flex-col justify-center">
      <div className="">
      <img src="/images/kirino-ai-02-mascot.png" alt="RAG" className="w-1/4 mx-auto rounded-full my-2 hover:animate-spin" />
      </div>
      <div className="text-center mx-auto text-conifer-500">
        <h1 className="font-extra-bold">
          My RAG AI Can't Be This ... Easy
        </h1>
        <h2 className="">
          to Generate
        </h2>
      </div>

      <div className="relative bg-old-lace-100 p-4 mt-8 rounded-xl overflow-clip shadow-2xl">
        {/* Prompt text */}
        <p className="text-xl mb-2">What kind of anime story are you looking for?</p>
        {/* Textarea for prompt input */}
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt..."
          className={`
            border-1 border-old-lace-200 bg-old-lace-200 rounded-lg px-4 py-2 w-full
            text-old-lace-900
            focus:outline-none focus:border-old-lace-500 resize-none
            `}
        />
        {/* Button to generate response */}
        <button
          onClick={generate}
          disabled={isThinking || !prompt.trim()}
          className={`
            bg-conifer-500 text-white w-full
            px-4 py-2 rounded-lg hover:bg-conifer-600
            disabled:bg-slate-300 disabled:cursor-not-allowed disabled:text-slate-400
          `}
        >
          Generate
        </button>

        <div className="mt-4">
          <span>Provider:</span>
          {/* Dropdown */}
          <select
            className="ml-4 border-1 border-old-lace-700 bg-old-lace-200 rounded-lg px-2 py-1 text-old-lace-900 focus:outline-none focus:border-old-lace-500"
            value={provider}
            onChange={(e) => handleProviderChange(e.target.value as AI_PROVIDER)}
          >
            <option value={AI_PROVIDER.OPENAI}>{AI_PROVIDER.OPENAI}</option>
            <option value={AI_PROVIDER.OLLAMA}>{AI_PROVIDER.OLLAMA}</option>
          </select>
        </div>

        {/* Thinking/loading animation */}
        {isThinking && (
          <div className="w-full h-full bg-old-lace-800/50 backdrop-blur-xs absolute top-0 left-0 fade-in-and-scale rounded-xl">
            <div className="flex h-full flex-col justify-center items-center animate-bounce">
              <div className="animate-pulse text-old-lace-500 rounded-lg px-4 py-2 font-bold bg-old-lace-200">
                <span className="block">{provider} is</span>
                <span className="text-4xl">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Thinking/loading text */}
      {
        isThinking && thinkMessage !== '' && (
          <div className="mt-8 mx-auto w-3/4 fade-in">
            <p className="text-lg text-slate-500/50 mb-2">I'm thinking...</p>
            <div ref={_thinkingTextDivRef} className="px-4 py-4 max-h-16 hover:max-h-36 transition-all text-slate-700/75 bg-slate-500/25 rounded-lg overflow-y-auto scroll-auto">
              <Markdown>{thinkMessage}</Markdown>
            </div>
          </div>
        )
      }

      {/* Generated response */}
      {
        message && (
          <div className="w-full mt-4 bg-old-lace-400 rounded-lg p-4 response-box fade-in-and-slide-up">
            <p className="text-base mb-2 text-old-lace-200">Here's what I came up with:</p>
            <div className="whitespace-pre-wrap text-lg text-old-lace-50">
              <Markdown>
                {message}
              </Markdown>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default GeneratePage