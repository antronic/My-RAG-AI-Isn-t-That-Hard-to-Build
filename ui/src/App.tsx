import { treaty } from '@elysiajs/eden'
// import './App.css'

import type { App } from '../../api/http'
import { RouterProvider } from 'react-router'
import { Router } from './router'

// @ts-expect-error
export const app = treaty<App>('localhost:9009')


function App() {
  return (
    <RouterProvider router={Router}/>
  )
}

export default App
