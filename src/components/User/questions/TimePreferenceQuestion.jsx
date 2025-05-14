import React from 'react'
import {CheckCircle, Clock} from 'lucide-react'

function TimePreferenceQuestion({ selected, onSelect }) {
    const timeOptions = [
      { id: 'early', label: 'Early (Before 9 AM)' },
      { id: 'morning', label: 'Morning (9 AM - 12 PM)' },
      { id: 'noon', label: 'Noon (12 PM - 2 PM)' },
      { id: 'afternoon', label: 'Afternoon (2 PM - 5 PM)' },
      { id: 'evening', label: 'Evening (After 5 PM)' },
      { id: 'weekend', label: 'Weekends (Saturday & Sunday)' }
    ];
  
    return (
      <div className="max-w-3xl mx-auto mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">When is the best time of day for your visit?</h2>
        <p className="text-gray-600 mb-8">Select all time slots that work for you</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {timeOptions.map((option) => (
            <div 
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={`${selected.includes(option.id) ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-200' : 'bg-white hover:bg-gray-50'} 
                border rounded-xl p-4 cursor-pointer transition-all flex justify-between items-center`}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <Clock size={20} className="text-blue-600" />
                </div>
                <span className="font-medium">{option.label}</span>
              </div>
              
              {selected.includes(option.id) && (
                <CheckCircle size={20} className="text-blue-600" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

export default TimePreferenceQuestion