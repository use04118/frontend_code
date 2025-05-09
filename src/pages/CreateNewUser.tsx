import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

type BusinessOption = {
  id: string;
  name: string;
};

const CreateNewUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    role_name: '',
    business_id: '',
  });

  const navigate = useNavigate();
  const { userId } = useParams();
  console.log('userId from params:', userId); // should print '4'
  const [businessOptions, setBusinessOptions] = useState<BusinessOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('Token not found');

        const response = await axios.get(`${API_URL}/users/my-business/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const businessList: BusinessOption[] = response.data.businesses;
        setBusinessOptions(businessList);

        setFormData((prev) => ({
          ...prev,
          business_id: businessList[0]?.id || '',
        }));
      } catch (err) {
        setError('Failed to load businesses');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  // console.log(userId);

  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        try {
          const token = localStorage.getItem('accessToken');
          const response = await axios.get(
            `${API_URL}/users/staff/${userId}/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          setFormData({
            name: response.data.name,
            mobile: response.data.mobile,
            role_name: response.data.role,
            business_id: response.data.business_id,
          });
        } catch (err) {
          console.error('Failed to fetch user data:', err);
        }
      };
      // console.log(fetchUserData());
      fetchUserData();
    }
  }, [userId]);

  console.log('data',formData)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Token not found');

      if (userId) {
        // Update existing user
        const response = await axios.patch(
          `${API_URL}/users/staff/${userId}/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        console.log('User updated:', response.data);
      } else {
        // Create new user
        const response = await axios.post(
          `${API_URL}/users/invite-staff/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        console.log('User created successfully:', response.data);
      }

      navigate('/settings');
    } catch (err) {
      console.error('Failed to submit user data:', err);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 p-4 sm:p-8">
      <div className="mx-auto bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 sm:p-10">
        <h2 className="text-2xl font-semibold mb-6 dark:text-white">
          {userId ? 'Edit User' : 'Add User'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter user's name"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">
                Mobile Number
              </label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter user's mobile number"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">
                User Role
              </label>
              <select
                name="role_name"
                value={formData.role_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Role</option>
                <option value="salesman">Salesman</option>
                <option value="delivery_boy">Delivery Boy</option>
                <option value="stock_manager">Stock Manager</option>
                <option value="partner">Partner</option>
                <option value="accountant">Accountant</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-white">
                Business
              </label>
              <select
                name="business_id"
                value={formData.business_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {businessOptions.map((biz) => (
                  <option key={biz.id} value={biz.id}>
                    {biz.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-2 rounded-md border border-gray-400 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              {userId ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNewUser;
