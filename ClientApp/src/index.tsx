import React from 'react'
import ReactDOM from 'react-dom'
import './assets/css/App.css'
import { ChakraProvider } from '@chakra-ui/react'
import theme from './theme/theme'
import { BrowserRouter } from 'react-router-dom'
import App from 'App'

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </ChakraProvider>,
  document.getElementById('root')
)
