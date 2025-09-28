import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import ProductDetail from './pages/ProductDetail';
import Portfolio from './pages/Portfolio';
import Login from './pages/Login';
import KYCForm from './pages/KYCForm';
import Watchlist from "./pages/Watchlist";




function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<KYCForm />} />
        

        <Route element={<Layout />}>
        <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/product/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
          <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
        </Route>
      </Routes>
    </>
  )
}

export default App;