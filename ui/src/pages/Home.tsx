const HomePage = () => {
  return (
    <div className="text-center h-screen flex flex-col justify-center">
      <div className="my-4">
        <h1 className="text-conifer-500">My RAG AI Isn't That Hard</h1>
        <p className="text-conifer-500 text-2xl">to Build</p>
      </div>

      <div className="text-2xl font-bold grid grid-cols-4 gap-4">
        <a href="/generate" className="scale-100 col-start-2 active:scale-90 hover:scale-110 transition-all">
          <img src="/images/kirino-ai-02-generate.png" alt="RAG" className="w-1/2 mx-auto rounded-lg my-2" />
          <p className="">Generate</p>
        </a>
        <a href="/search" className="scale-100 active:scale-90 hover:scale-110 transition-all">
          <img src="/images/kirino-ai-02-search.png" alt="RAG" className="w-1/2 mx-auto rounded-lg my-2" />
          <p className="">Search</p>
        </a>
      </div>
    </div>
  )
}

export default HomePage