import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/Home';
import SignupPage from './pages/Signup';
import VerifyEmailPage from './pages/Verify';
import LoginPage from './pages/Login';
import ReportsPage from './pages/Reports';
import UserDashboard from './pages/UserDashboard';
import About from './pages/About';
import AdminDashboard from './pages/Admin';
function App() {
  

  return (
    <>
    <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify" element={<VerifyEmailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/user" element={<UserDashboard/>} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      <Footer />
    </Router>
    </>
  )
}

export default App
