import React from 'react'
import ReactDOM from 'react-dom/client'
import KitchenSink from './KitchenSink.jsx'
import './kitchen-sink.css'

const root = ReactDOM.createRoot(document.getElementById('app'))
root.render(
  <React.StrictMode>
    <main>
      <KitchenSink />
    </main>
  </React.StrictMode>
)
