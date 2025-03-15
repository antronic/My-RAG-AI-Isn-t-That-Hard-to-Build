const HomePage = () => {
  return (
    <div className="text-center h-screen flex flex-col justify-center">
      <div className="my-4">
        <h1 className="text-conifer-500">My RAG AI Isn't That Hard</h1>
        <p className="text-conifer-500 text-2xl">to Build</p>
      </div>

      <ul className="text-2xl font-bold list-disc list-inside">
        <li>
          <a href="/generate">Generate</a>
        </li>
        <li>
          <a href="/search">Search</a>
        </li>
      </ul>
    </div>
  )
}

export default HomePage