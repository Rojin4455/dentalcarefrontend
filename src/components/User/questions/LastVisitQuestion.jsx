import React from 'react'
import {CheckCircle} from 'lucide-react'

function LastVisitQuestion({ answer, onSelect }) {
    const options = [
        { value: 'less-than-1', label: 'Less than 1 year', description: 'Regular check-ups are recommended' },
        { value: '1-2', label: '1-2 years', description: 'Getting back on track' },
        { value: 'more-than-2', label: 'More than 2 years', description: "We'll help you get back to regular care" },
        { value: 'never', label: "I've never visited", description: "No problem! We'll make it a great first experience" }
      ];
      

  return (
    <div className="max-w-3xl mx-auto mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-3">When was your last visit to the dentist?</h2>
      <p className="text-gray-600 mb-8">This helps us recommend the right type of appointment</p>
      
      <div className="space-y-4">
        {options.map((option) => (
          <div 
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={`${answer === option.value ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200' : 'bg-white hover:bg-gray-50'} 
              border rounded-xl p-5 cursor-pointer transition-all`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-lg">{option.label}</h3>
                <p className="text-gray-600 mt-1">{option.description}</p>
              </div>
              {answer === option.value && (
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

export default LastVisitQuestion