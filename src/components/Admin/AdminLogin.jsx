import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import axiosInstance from '../../api/axiosInstance';
import { setUser } from '../../slices/userSlice';




export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const BASE_API_URL = import.meta.env.VITE_BASE_API_URL

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector((state) => state.user)
  console.log("user: , iser", user)


  // const [searchParams] = useSearchParams();
  // const locationId = searchParams.get('locationId');
  
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm({
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data) => {
    console.log("login data:", data)
    try{
      const response = await axiosInstance.post(`${BASE_API_URL}api/auth/login/`,{
        email:data.email,
        password:data.password
      })

      if(response.status === 200){
        console.log("success response: ",response )
        dispatch(setUser({ accessToken: response.data.data.access, isAdmin:response.data.data.isAdmin, user: {email:response.data.data.email,id:response.data.data.id}}));
        toast.success('Successfully logged in');
        navigate(`/admin/home`);
      }else{
        console.error("error response")
        toast.error("Error response")
      }


    }catch(error){
      console.error("Something went wrong: ", error.response.data.message)
      toast.error(`${error.response.data.message}`)
    }


  };
  



const handleLogin = async (data) => {
  
};


  const handleSignup = async (data) => {
    
  }



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-white to-orange-100 p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-8 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-700"></div>
          
          {/* Logo and title */}
          <div className="flex flex-col items-center space-y-3">
            {/* <div className="p-2 rounded-full">
            <img src="https://msgsndr-private.storage.googleapis.com/companyPhotos/399c65a9-7382-44b4-b8eb-8632ba9d5e7a.png" alt="Logo" className="w-full h-12" />

            </div> */}
            <h1 className="text-xl font-bold text-gray-800">Dental Care Admin Portal</h1>
            <p className="text-gray-600 text-center">
              {isLogin ? 'Welcome back! Please login to your account.' : 'Create an account to get started'}
            </p>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  className={`pl-11 block w-full rounded-lg border-gray-300 bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent py-3 text-sm placeholder-gray-400 ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register("password", { 
                    required: "Password is required",
                    minLength: {
                      value: 4,
                      message: "Password must be at least 4 characters"
                    }
                  })}
                  className={`pl-11 pr-11 block w-full rounded-lg border-gray-300 bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent py-3 text-sm placeholder-gray-400 ${
                    errors.password ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium button hover:bg-primaryHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Loading...' : isLogin ? 'Sign in' : 'Create Account'}
          </button>

          </form>

        
        </div>
      </div>
    </div>
  );
}