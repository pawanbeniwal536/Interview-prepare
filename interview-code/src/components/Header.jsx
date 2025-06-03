import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <header className="bg-blue-600 text-white py-4 px-4 md:px-8">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold">
          <Zap size={28} className="text-white" />
          <span>RoadAssist Pro</span>
        </Link>
        
        <nav>
          <ul className="flex space-x-6">
            {isAdminPage ? (
              <>
                <li>
                  <Link to="/admin/dashboard\" className="hover:text-blue-200 transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/admin/policies" className="hover:text-blue-200 transition-colors">
                    Policies
                  </Link>
                </li>
                <li>
                  <Link to="/admin/customers" className="hover:text-blue-200 transition-colors">
                    Customers
                  </Link>
                </li>
                <li>
                  <Link to="/admin/help" className="hover:text-blue-200 transition-colors">
                    Help
                  </Link>
                </li>


                 {/* <li>
                  <Link to="/admin/help" className="hover:text-blue-200 transition-colors">
                    help
                  </Link>
                </li> */}
                {isAuthenticated && (
                  <li>
                    <button 
                      onClick={logout}
                      className="hover:text-blue-200 transition-colors"
                    >
                      Logout
                    </button>
                  </li>
                )}
              </>
            ) : (
              <>
                <li>
                  <Link to="/" className="hover:text-blue-200 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-blue-200 transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-blue-200 transition-colors">
                    Contact
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;