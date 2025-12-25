
import { useEffect, useState } from 'react'
import axios from 'axios'
import { AI_PROVIDER } from '../const/llm'

function SearchPage() {
  const [searchResult, setSearchResult] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [provider, setProvider] = useState(AI_PROVIDER.OLLAMA)
  const [isSafeSearch, setSafeSearch] = useState(true)

  const search = async (q: string) => {
    // Clean up the search query
    setSearchResult([])
    // Make sure query is not empty
    if (!q.trim()) return
    // Make sure to replace with your actual API endpoint
    const result = await axios.get('http://localhost:9009/search', {
      params: {
        q: q,
        model: provider,
        safeSearch: isSafeSearch,
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

  const handleProviderChange = (newProvider: AI_PROVIDER) => {
    setProvider(newProvider)
  }


  useEffect(() => {
      document.title += ' | Search'
    }, [])

  return (
    <>
      <div className="max-w-2xl mx-auto px-4 py-12 h-full flex flex-col justify-center">
      <div className="">
        <img src="/images/kirino-ai-02-mascot.png" alt="RAG" className="w-1/4 mx-auto rounded-full my-2 hover:animate-spin" />
      </div>
      <div className="text-center mx-auto text-conifer-500">
        <h1 className="font-extra-bold">
          My RAG AI Can't Be This ... Easy
        </h1>
        <h2 className="">
          to Search
        </h2>
      </div>

        <div className="mt-4 flex gap-x-4">
          <input
            onKeyUp={onEnter}
            onChange={onChange}
            type="text"
            className={`
              border-1 border-old-lace-200 bg-old-lace-200 rounded-lg px-4 py-2 w-full
              text-old-lace-900
              focus:outline-none focus:border-old-lace-500
            `} />
          <button
            onClick={() => search(searchQuery)}
            className={`
              bg-conifer-500 text-white
              px-4 py-2 rounded-lg hover:bg-conifer-600
              disabled:bg-slate-300 disabled:cursor-not-allowed disabled:text-slate-400
            `}
            >Search</button>
          </div>

          <div className="mt-4 flex gap-x-4 items-center">
            <div className="">
              <span>Provider:</span>
              <select
                className="ml-4 border-1 border-old-lace-700 bg-old-lace-200 rounded-lg px-2 py-1 text-old-lace-900 focus:outline-none focus:border-old-lace-500"
                value={provider}
                onChange={(e) => handleProviderChange(e.target.value as AI_PROVIDER)}
              >
                <option value={AI_PROVIDER.OPENAI}>{AI_PROVIDER.OPENAI}</option>
                <option value={AI_PROVIDER.OLLAMA}>{AI_PROVIDER.OLLAMA}</option>
              </select>
            </div>

            <div className="">
              <input type="checkbox" checked={isSafeSearch} onChange={() => setSafeSearch(!isSafeSearch)} />
              <label className="ml-2">Safe Search</label>
            </div>
          </div>

        {
          searchResult.map((result) => (
            <div className='mt-4 px-4 py-2 bg-old-lace-200 rounded-lg fade-in-and-slide-up' key={result.id}>
              <h4>{result.title}</h4>
              <img src={result.image} alt={result.title} />
              <p className="py-4">{result.synopsis}</p>
              <a href={result.url} target='_blank' rel='noreferrer' className="my-4 inline-block bg-old-lace-400 hover:bg-old-lace-600 text-conifer-500 text-white rounded-lg px-4 py-2">
                Read More
              </a>
            </div>
          ))
        }
      </div>
    </>
  )
}

export default SearchPage
