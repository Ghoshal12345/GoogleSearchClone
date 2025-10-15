import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';


import AllResults from './pages/allResults.jsx';
import News from './pages/news.jsx'
import Images from './pages/images.jsx'
import Videos from './pages/videos.jsx'
import Home from './pages/home.jsx';

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/results",
    element: <App />,
    children: [
      {
        path: "",   // This will match exactly "/results"
        element: <AllResults />
      },
      {
        path: "news",    // relative path under "/results" -> "/results/news"
        element: <News />
      },
      {
        path: "images",
        element: <Images />
      },
      {
        path: "videos",
        element: <Videos />
      },
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider>
      <RouterProvider router={routes} />
    </MantineProvider>
  </StrictMode>,
)
