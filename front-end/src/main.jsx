import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MouseFollower } from 'react-mouse-follower'
import ShopContextProvider from './context/ShopContext.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ShopContextProvider>
    <MouseFollower/>
    <Provider store={store} >
      <App />
    </Provider>
    </ShopContextProvider>
  </StrictMode>,
)
