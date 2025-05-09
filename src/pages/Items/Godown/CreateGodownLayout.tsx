import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import StateDropdown from './StateDropdown';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// Props type
interface CreateGodownLayoutProps {
  editingGodown?: {
    id?: string;
    godownName?: string;
    streetAddress?: string;
    state?: string;
    pincode?: string;
    city?: string;
  };
}

// State type
interface GodownFormData {
  godownName: string;
  streetAddress: string;
  state: string;
  pincode: string;
  city: string;
}

const CreateGodownLayout: React.FC<CreateGodownLayoutProps> = ({ editingGodown }) => {
  const API_URL = import.meta.env.VITE_API_URL as string;
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // State to store form inputs
  const [formData, setFormData] = useState<GodownFormData>({
    godownName: '',
    streetAddress: '',
    state: '',
    pincode: '',
    city: '',
  });

  useEffect(() => {
    if (id) {
      fetchGodownData(id);
    }
  }, [id]);

  const fetchGodownData = async (godownId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Token not found");

      const response = await axios.get(`${API_URL}/godown/godown/${godownId}/`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      if (response.data) {
        setFormData({
          godownName: response.data.godownName || '',
          streetAddress: response.data.streetAddress || '',
          state: response.data.state || '',
          pincode: response.data.pincode || '',
          city: response.data.city || '',
        });
      }
    } catch (error) {
      console.error("Error fetching Godown details:", error);
    }
  };

  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  // Handle state selection from dropdown
  const handleStateSelect = (selectedState: string) => {
    setFormData((prevState) => ({ ...prevState, state: selectedState }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Token not found");
      return;
    }

    try {
      let response;
      if (id) {  // Check if it's an edit operation using URL id
        response = await axios.put(
          `${API_URL}/godown/godown/${id}/`,
          formData,
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );
        alert("Godown updated successfully!");
      } else {
        response = await axios.post(`${API_URL}/godown/godown/`, formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        alert("Godown created successfully!");
      }

      console.log("Success:", response.data);
      navigate(-1);
    } catch (error) {
      console.error("Error saving godown:", error);
      alert("Failed to save godown. Please try again.");
    }
  };

  const handleBack = () => {
    navigate(-1); // Navigates back to the previous page
  };

  return (
    <>
      <Breadcrumb pageName={editingGodown ? "Edit Godown" : "Create Godown"} />

      <div className="w-full flex flex-col gap-9">
        <div className="w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Godown Details
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Godown name <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="godownName"
                    placeholder="Enter Godown Name"
                    value={formData.godownName || ''}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
              <div className="w-full">
                <label className="mb-2.5 block text-black dark:text-white">
                  Street Address
                </label>
                <textarea
                  rows={3}
                  name="streetAddress"
                  placeholder="Enter Street Address"
                  value={formData.streetAddress || ''}
                  onChange={handleInputChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                ></textarea>
              </div>
              <StateDropdown onSelectState={handleStateSelect} />

              <div className="mb-4.5">
                <label className="mb-2.5 block text-black dark:text-white">
                  Pincode
                </label>
                <div className="flex gap-2">
                  <div className="relative w-full">
                    <input
                      type="number"
                      name="pincode"
                      placeholder="ex: 560029"
                      value={formData.pincode || ''}
                      onChange={handleInputChange}
                      className="w-full pl-8 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>
              </div>
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-2.5 block text-black dark:text-white">
                    City <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="ex: Bangalore"
                    value={formData.city || ''}
                    onChange={handleInputChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>

              <div className="border-b border-stroke py-0.5 px-6.5 dark:border-strokedark mb-6"></div>

              {/* Buttons: Close & Save */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="rounded border border-gray-400 px-4 py-2 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="rounded bg-primary px-4 py-2 text-white hover:bg-opacity-90"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateGodownLayout;

