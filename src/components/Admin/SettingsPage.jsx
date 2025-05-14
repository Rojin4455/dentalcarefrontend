import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import {toast} from 'sonner'
import { clearUser, setUser } from '../../slices/userSlice';
import {useDispatch} from 'react-redux'
import {useNavigate} from 'react-router-dom'

function SettingsPage({user}) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const openLogoutModal = () => setShowLogoutModal(true);
  const closeLogoutModal = () => setShowLogoutModal(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const BASE_API_URL = import.meta.env.VITE_BASE_API_URL


const onLogout = async () => {
  console.log("on logout");
  try {
    const response = await axiosInstance.post(`${BASE_API_URL}api/auth/logout/`);
    console.log("Logout response:", response);

    if (response.status === 200) {
      toast.success("Logout successfully");
      dispatch(clearUser());
      navigate('/admin');
    } else {
      toast.error("Something went wrong");
    }
  } catch (error) {
    console.error("Logout error:", error);
    toast.error("Something went wrong");
  }
};

  
  const handleLogout = () => {
    closeLogoutModal();
    if (onLogout) onLogout();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Account Settings</h2>
        <div className="bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-xs font-medium">
          {user.user.email}
        </div>
      </div>

      <div className="flex-grow">
        {/* Settings sections */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Profile</h3>
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-800">Account Settings</p>
              <p className="text-sm text-gray-500">Coming soon</p>
            </div>
            <div className="ml-auto">
              <button 
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Session section */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4">Session</h3>
          <div className="space-y-4">
            <button 
              onClick={openLogoutModal}
              className="flex items-center w-full p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors group"
            >
              <div className="h-10 w-10 bg-red-100 group-hover:bg-red-200 rounded-full flex items-center justify-center mr-4 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 3a1 1 0 10-2 0v6.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L14 12.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-800">Logout</p>
                <p className="text-sm text-gray-500">Sign out from your account</p>
              </div>
              <div className="ml-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* <div className="mt-8 pt-4 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-500">
          © 2025 Dental Clinic. All rights reserved.
        </p>
      </div> */}

      {/* Logout confirmation modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 animate-fade-in">
            <div className="text-center mb-6">
              <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Sign out?</h3>
              <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to sign out from your account?
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
              <button
                onClick={closeLogoutModal}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add custom animation class */}
      {/* <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style> */}
    </div>
  );
}

export default SettingsPage;