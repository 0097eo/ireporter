import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';
import PropTypes from 'prop-types';


const NavItem = ({ to, children, setIsOpen }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block py-2 px-4 ${
          isActive ? 'text-blue-500' : 'text-gray-400 hover:text-gray-300'
        }`
      }
      onClick={() => setIsOpen(false)}
    >
      {children}
    </NavLink>
  );
  
  NavItem.propTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    setIsOpen: PropTypes.func.isRequired,
  };

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/')
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-600 p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <NavLink to="/" className="text-white hover:text-gray-300 text-xl font-semibold">
              iReporter
            </NavLink>
          </div>
          <div className="hidden md:flex space-x-6">
            <NavItem to="/" setIsOpen={setIsOpen}>Home</NavItem>
            <NavItem to="/reports" setIsOpen={setIsOpen}>Incidents</NavItem>
            <NavItem to="/about" setIsOpen={setIsOpen}>About</NavItem>
            {user?.userType === 'admin' && <NavItem to="/admin" setIsOpen={setIsOpen}>Admin</NavItem>}
            {user?.userType === 'customer' && <NavItem to="/user" setIsOpen={setIsOpen}>Profile</NavItem>}
          </div>
          <div className="hidden md:block">
            {user ? (
              <button
                onClick={handleLogout}
                className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300"
              >
                Logout
              </button>
            ) : (
              <NavLink to="/login">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300">
                  Login
                </button>
              </NavLink>
            )}
          </div>
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden mt-4">
            <NavItem to="/" setIsOpen={setIsOpen}>Home</NavItem>
            <NavItem to="/reports" setIsOpen={setIsOpen}>Reported Incidents</NavItem>
            {user?.userType === 'admin' && <NavItem to="/admin" setIsOpen={setIsOpen}>Admin</NavItem>}
            <NavItem to="/profile" setIsOpen={setIsOpen}>Profile</NavItem>
            <div className="mt-4">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300 w-full"
                >
                  Logout
                </button>
              ) : (
                <NavLink to="/login" className="block w-full" onClick={() => setIsOpen(false)}>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300 w-full">
                    Login
                  </button>
                </NavLink>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;