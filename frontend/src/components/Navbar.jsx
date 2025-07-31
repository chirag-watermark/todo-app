import { useState } from 'react';
import { FiMoon, FiUser, FiLogOut, FiHome, FiCalendar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext.jsx';

const Navbar = ({ user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  // Get current date and day
  const getCurrentDate = () => {
    const now = new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return now.toLocaleDateString('en-US', options);
  };

  const getCurrentDay = () => {
    const now = new Date();
    const options = { weekday: 'long' };
    return now.toLocaleDateString('en-US', options);
  };


  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '?';
    return name.trim().charAt(0).toUpperCase();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };  

  function handleLogout() {
    logout();
    navigate("/");
    toast.success("You have been logged out successfully");
  }

  function handleProfile() {
    navigate("/profile");
    setIsDropdownOpen(false);

  }

  if (!isAuthenticated()) { 
    navigate("/");
  }

  return (
    <div>
      <nav className="flex items-center justify-around px-6 py-3 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200">
        {/* App Name on the left */}
        <div className="flex items-center space-x-3" onClick={() => navigate("/homepage")}>
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <Plus className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Todo App</span>
        </div>
        
        {/* Right side icons */}
        <div className="flex items-center space-x-4">
          {/* Date and Day Display */}
          <div className="hidden sm:flex items-center space-x-3 px-3 py-2">
            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center">
              <FiCalendar className="h-3 w-3 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-gray-900 dark:text-white leading-tight">
                {getCurrentDay()}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-tight">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Dark Mode Icon */}
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <FiMoon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          
          {/* User Profile Dropdown */}
          <div className="relative">
            <button 
              className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              onClick={toggleDropdown}
            >
              {/* Avatar with user's first letter */}
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {getInitials(user?.name || user?.username || 'User')}
                </span>
              </div>
            </button>
            
                         {/* Dropdown Menu */}
             {isDropdownOpen && (
               <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                 {/* User Info */}
                 <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                   <p className="text-sm font-medium text-gray-900 dark:text-white">
                     Hi, {user?.name || user?.username || 'User'}
                   </p>
                   <p className="text-xs text-gray-500 dark:text-gray-400">
                     {user?.username || 'user@example.com'} {/* TODO: Add email */}
                   </p>
                 </div>
                 

                
                {/* Menu Items */}
                <div className="py-1">
                  <button 
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    onClick={() => handleProfile()}
                  >
                    <FiUser className="mr-3 h-4 w-4" />
                    Profile
                  </button>

                  
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  
                  <button 
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    onClick={handleLogout}
                  >
                    <FiLogOut className="mr-3 h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      {/* Overlay to close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsDropdownOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Navbar;       