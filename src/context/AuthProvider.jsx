import { createContext, useContext, useEffect, useState } from 'react';
import {
  postLoginRequest,
  verifyTokenRequest,
  getUsersRequest,
  postUserRequest,
} from '../api/user.js';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const postRegister = async body => {
    try {
      const res = await postUserRequest(body);
      console.log(res.data);
    } catch (error) {
      if (Array.isArray(error.response.data)) {
        setErrors([error.response.data[0]]);
      } else if (typeof error.response.data === 'string') {
        setErrors([error.response.data]);
      } else if (error.response.data.message) {
        setErrors([error.response.data.message]);
      } else {
        setErrors(['Error']);
      }
      console.error(error);
      return false;
    }
  };

  const postLogin = async body => {
    try {
      const res = await postLoginRequest(body);
      // console.log(res.data);
      setUser(res.data);
      setIsAuthenticated(true); // ✅ Establecer autenticación en login
    } catch (error) {
      if (Array.isArray(error.response.data)) {
        setErrors([error.response.data[0]]);
      } else if (typeof error.response.data === 'string') {
        setErrors([error.response.data]);
      } else if (error.response.data.message) {
        setErrors([error.response.data.message]);
      } else {
        setErrors(['Error']);
      }
      console.error(error);
      return false;
    }
  };

  const getUsers = async () => {
    try {
      const res = await getUsersRequest();
      setUsers(res.data);
      console.log(res.data);
    } catch (error) {
      if (Array.isArray(error.response.data)) {
        setErrors([error.response.data[0]]);
      } else if (typeof error.response.data === 'string') {
        setErrors([error.response.data]);
      } else if (error.response.data.message) {
        setErrors([error.response.data.message]);
      } else {
        setErrors(['Error']);
      }
      console.error(error);
      return false;
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    async function CheckLogin() {
      const cookies = Cookies.get();
      // console.log('Cookies:', cookies);

      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false);
        setUser(null);
        return;
      }

      try {
        // ✅ Ahora sí recibe el token como parámetro
        const res = await verifyTokenRequest(cookies.token);
        // console.log('Response:', res);

        if (res.data && res.data.user) {
          setIsAuthenticated(true);
          setUser(res.data.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
        setLoading(false);
      } catch (error) {
        console.log('Token verification error:', error);
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }
    }
    CheckLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        errors,
        users,
        user,
        logout,
        getUsers,
        postLogin,
        postRegister,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
