import { createBrowserRouter, RouteObject } from 'react-router'
import DefaultLayout from './layouts/DefaultLayout'
import HomePage from './pages/Home'
import GeneratePage from './pages/Generate'
import SearchPage from './pages/Search'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <DefaultLayout/>,
    children: [
      // Home page
      {
        path: '/',
        element: <HomePage />
      },
      // Generate page
      {
        path: '/generate',
        element: <GeneratePage />
      },
      // Search page
      {
        path: '/search',
        element: <SearchPage />
      },
    ],
  }
]

export const Router = createBrowserRouter(routes)