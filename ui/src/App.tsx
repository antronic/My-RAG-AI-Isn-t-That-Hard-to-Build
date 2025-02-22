import { useState } from 'react'
import './App.css'
import axios from 'axios'

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

  return (
    <>
      <div>
        <h1>This is a semantic search</h1>

        <div className="mt-4">
          <input onChange={(e) => setSearchQuery(e.target.value)} type="text" className="text-white border-2 border-slate-200 bg-transparent rounded-xl px-4 py-2" />
          <button onClick={() => search(searchQuery)} className="rounded-xl px-4 py-2 ml-4 border-2 border-slate-600">Search</button>
        </div>

        {
          searchResult.map((result) => (
            <div>
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
