
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Home } from './pages/Home'
import { Signin } from './pages/Signin'
import { Signup } from './pages/Signup'
import { Dashboard } from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import DocSyncEditor from './components/DocSyncEditor'
function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />

        <Route element={<ProtectedRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/dashboard/document/d/:id/edit' element={<DocSyncEditor/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}


export default App
