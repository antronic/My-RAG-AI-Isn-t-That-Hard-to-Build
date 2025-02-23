import axios from 'axios'

export const ChatPage = () => {
  const generate = async () => {
    const result = await axios.post('http://localhost:9009/chat', {
          prompt: 'Why the sky is blue',
        })
      console.log(result)
  }

  return (
    <div>
      <button onClick={generate}>Generate</button>
    </div>
  )
}

export default ChatPage