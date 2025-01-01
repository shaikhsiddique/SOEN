import React from 'react'
import AppRoutes from './routes/AppRoutes'
import { UserProvider } from './context/UserContext'



function App() {
  return (
  <UserProvider>
     <AppRoutes></AppRoutes>
  </UserProvider>
  )
}

export default App