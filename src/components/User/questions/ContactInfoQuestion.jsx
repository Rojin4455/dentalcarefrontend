import React from 'react'
import {CheckCircle, Mail} from 'lucide-react'

function ContactInfoQuestion({ email, onEmailChange }) {
    return (
      <div className="max-w-3xl mx-auto mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">What is your contact info?</h2>
        <p className="text-gray-600 mb-8">We'll use this to send your personalized clinic recommendations</p>
        
        <div className="bg-white rounded-xl border p-6">
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={20} className="text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                placeholder="yourname@example.com"
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
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