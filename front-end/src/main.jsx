import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MouseFollower } from 'react-mouse-follower'
import ShopContextProvider from './context/ShopContext.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ShopContextProvider>
      <MouseFollower />
      <Provider store={store} >
       <QueryClientProvider client={queryClient} >
         <App />
       </QueryClientProvider>
      </Provider>
    </ShopContextProvider>
  </StrictMode>,
)
