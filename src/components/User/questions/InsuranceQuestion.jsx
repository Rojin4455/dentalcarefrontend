import React from 'react'
import {CreditCard, X} from 'lucide-react'

function InsuranceQuestion({ answer, onSelect }) {
    return (
      <div className="max-w-3xl mx-auto mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Do you have dental insurance?</h2>
        <p className="text-gray-600 mb-8">This helps us match you with clinics that accept your coverage</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            onClick={() => onSelect('Yes')}
            className={`${answer === 'Yes' ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200' : 'bg-white hover:bg-gray-50'} 
              border rounded-xl p-6 cursor-pointer transition-all flex items-center`}
          >
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <CreditCard size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-lg">Yes – I have insurance</h3>
              <p className="text-gray-600 text-sm mt-1">We'll find dentists who accept your plan</p>
            </div>
          </div>
          
          <div 
            onClick={() => onSelect('No')}
            className={`${answer === 'No' ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200' : 'bg-white hover:bg-gray-50'} 
              border rounded-xl p-6 cursor-pointer transition-all flex items-center`}
          >
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-4">
              <X size={20} className="text-gray-600" />
            </div>
            <div>
              <h3 className="font-medium text-lg">No - I don't have insurance</h3>
              <p className="text-gray-600 text-sm mt-1">We'll show options with transparent pricing</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

export default InsuranceQuestion