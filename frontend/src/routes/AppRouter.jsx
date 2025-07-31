import { createBrowserRouter } from 'react-router-dom';
import { Login } from '../components/Login.jsx';
import { Signup } from '../components/Signup.jsx';
import { Homepage } from '../components/Homepage.jsx';
import { Profile } from '../components/Profile.jsx';
import { ProtectedRoute, PublicRoute } from '../components/ProtectedRoute.jsx';

export const createAppRouter = () => {
  return createBrowserRouter([
    {
      path: '/',
      element: <PublicRoute />,
      children: [
        {
          index: true,
          element: <Login />
        },
        {
          path: 'signup',
          element: <Signup />
        }
      ]
    },
    {
      path: '/',
      element: <ProtectedRoute />,
      children: [
        {
          path: 'homepage',
          element: <Homepage />
        },
        {
          path: 'profile',
          element: <Profile />
        }
      ]
    }
  ]);
}; 