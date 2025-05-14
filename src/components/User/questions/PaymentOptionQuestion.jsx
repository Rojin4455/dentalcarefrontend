import React from 'react'
import {CheckCircle} from 'lucide-react'

function PaymentOptionQuestion({ answer, onSelect }) {
    const options = [
        { id: 'interested', label: 'Yes - I am interested in payment options', description: 'Financing plans, payment schedules, etc.' },
        { id: 'self-pay', label: "No - I'll cover the cost of my appointment", description: 'Direct payment options' },
        { id: 'assistance', label: "No - I'll use a social assistance program", description: 'Medicaid, state programs, etc.' }
      ];
      

  return (
    <div className="max-w-3xl mx-auto mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-3">Are you interested in exploring alternative payment options?</h2>
      <p className="text-gray-600 mb-8">Many dentists offer flexible payment plans</p>
      
      <div className="space-y-4">
        {options.map((option) => (
          <div 
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`${answer === option.id ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200' : 'bg-white hover:bg-gray-50'} 
              border rounded-xl p-5 cursor-pointer transition-all`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-lg">{option.label}</h3>
                <p className="text-gray-600 mt-1">{option.description}</p>
              </div>
              {answer === option.id && (
                <div className="text-blue-600">
                  <CheckCircle size={24} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PaymentOptionQuestion