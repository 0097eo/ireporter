import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('');
    const success = await login(username, password)
    if(success){
      const userType = localStorage.getItem('userType')
      if(userType === 'admin'){
        navigate('/admin');
      } else{
        navigate('/user');
      }
    }else{
      setError('Invalid credentials');
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 bg-gray-600 flex items-center justify-center">
        <img
          src="https://plus.unsplash.com/premium_photo-1661488538787-3028c44f0612?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Login illustration"
          className="object-cover h-screen flex-grow"
        />
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-extrabold text-center mb-6">Log in to SendIt</h2>
          {error && (
            <p className="text-red-500 text-center mb-4">{error}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Log In
              </button>
            </div>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Dont have an account?{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-green-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;