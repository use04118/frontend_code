import { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface UserData {
  name: string;
  designation: string;
  image: string;
}

interface UserContextType {
  userData: UserData;
  setUserData: (data: UserData) => void;
  fetchUserData: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [userData, setUserData] = useState({
    name: '',
    designation: '',
    image: '',
  });

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_URL}/users/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;

      setUserData({
        name: data.name,
        designation: data.mobile,
        image: data.profile_picture
          ? `${API_URL}${data.profile_picture}`
          : '',
      });
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};