import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux';
import {store} from  '../src/store'
import { Toaster } from 'sonner';
import '../src/index.css'
import './styles.css';



createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Toaster richColors position="top-center"/>
    <App />
    </Provider>
)
