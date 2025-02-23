import { useState } from 'react'
import './App.css'
import axios from 'axios'
import ChatPage from './Chat'

function App() {
  const [count, setCount] = useState(0)
  const [searchResult, setSearchResult] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const search = async (q: string) => {
    const result = await axios.get('http://localhost:9009/search', {
      params: {
        q: q,
      }
    })

    setSearchResult(result.data)
  }

  const onEnter = (e: any) => {
    if (e.key === 'Enter') {
      search(searchQuery)
    }
  }

  const onChange = (e: any) => {
    setSearchQuery(e.target.value)
  }

  if (window.location.pathname === '/chat') {
    return <ChatPage/>
  }

  return (
    <>
      <div>
        <h1>This is a semantic search</h1>

        <div className="mt-4 flex">
          <input onKeyUp={onEnter} onChange={onChange} type="text" className="text-white border-2 border-slate-200 bg-transparent rounded-xl px-4 py-2 flex-1" />
          <button onClick={() => search(searchQuery)} className="rounded-xl px-4 py-2 ml-2 border-2 border-slate-300">Search</button>
        </div>

        {
          searchResult.map((result) => (
            <div className='mt-4 px-4 py-2 bg-black/10 rounded-lg' key={result.id}>
              <h2>{result.title}</h2>
              <p>{result.rating}</p>
            </div>
          ))
        }
      </div>
    </>
  )
}

export default App
