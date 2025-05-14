import React from 'react'


function InsuranceProviderQuestion({ answer, onSelect }) {
    const providers = [
      'Aetna', 'Cigna', 'Delta Dental', 'Guardian', 
      'Medicaid', 'MetLife', 'UnitedHealthcare', 'Other provider...'
    ];
  
    return (
      <div className="max-w-3xl mx-auto mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Who is your dental insurance provider?</h2>
        <p className="text-gray-600 mb-8">We'll find dentists who accept your insurance</p>
        
        <div className="bg-white rounded-xl border p-4">
          <select
            value={answer}
            onChange={(e) => onSelect(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="" disabled>Select your insurance provider</option>
            {providers.map((provider, index) => (
              <option key={index} value={provider}>{provider}</option>
            ))}
          </select>
        </div>
      </div>
    );
  }
  

export default InsuranceProviderQuestion