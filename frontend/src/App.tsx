import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { Home } from './pages/Home';
import { Signin } from './pages/Signin';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import DocSyncEditor from './components/DocSyncEditor';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
          {/* Document Editor Route with id and accessType as parameters */}
          <Route path='/dashboard/document/d/:id/:accessType' element={<DocSyncEditor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
