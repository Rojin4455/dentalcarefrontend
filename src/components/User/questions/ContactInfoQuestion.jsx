import React from 'react'
import {CheckCircle, Mail, User} from 'lucide-react'

function ContactInfoQuestion({ name, email, onEmailChange, onNameChange }) {
    return (
      <div className="max-w-3xl mx-auto mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">What is your contact info?</h2>
        <p className="text-gray-600 mb-8">We'll use this to send your personalized clinic recommendations</p>
        
        <div className="bg-white rounded-xl border p-6">
        <div className="space-y-6">
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-gray-700 font-medium mb-1">Full Name</label>
        <div className="relative">
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Your full name"
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User size={20} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email Address</label>
        <div className="relative">
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="you@example.com"
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail size={20} className="text-gray-400" />
          </div>
        </div>
      </div>
    </div>
          
          <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg mt-4 flex items-start">
            <div className="flex-shrink-0 mr-3 mt-1">
              <CheckCircle size={16} className="text-green-600" />
            </div>
            <p>
              Your information is kept private and secure. We'll only use your email to send your clinic matches
              and appointment confirmation details.
            </p>
          </div>
        </div>
      </div>
    );
  }

export default ContactInfoQuestion