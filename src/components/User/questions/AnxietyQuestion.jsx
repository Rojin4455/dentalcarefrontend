import React from 'react'
import {Frown, Meh, Smile} from 'lucide-react'

function AnxietyQuestion({ answer, onSelect }) {
    const options = [
      { value: 'not-nervous', label: 'Not at all nervous', icon: <Smile size={24} className="text-green-500" /> },
      { value: 'little-nervous', label: 'A little nervous', icon: <Smile size={24} className="text-blue-500" /> },
      { value: 'moderately-nervous', label: 'Moderately nervous', icon: <Meh size={24} className="text-yellow-500" /> },
      { value: 'very-nervous', label: 'Very nervous', icon: <Frown size={24} className="text-orange-500" /> },
      { value: 'extremely-nervous', label: 'Extremely nervous', icon: <Frown size={24} className="text-red-500" /> }
    ];
  
    return (
      <div className="max-w-3xl mx-auto mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">How do you feel about visiting the dentist?</h2>
        <p className="text-gray-600 mb-8">We want to ensure you're comfortable during your visit</p>
        
        <div className="bg-white rounded-xl p-6 border">
          <div className="space-y-2">
            {options.map((option, index) => (
              <div 
                key={option.value}
                onClick={() => onSelect(option.value)}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all
                  ${answer === option.value ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
              >
                <div className="w-8 h-8 mr-3 flex items-center justify-center">
                  {option.icon}
                </div>
                <span className="font-medium">{option.label}</span>
                
                {/* Background pill for selected */}
                {answer === option.value && (
                  <div className="ml-auto">
                    <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Visual scale bar */}
          <div className="mt-6 h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full"></div>
        </div>
      </div>
    );
  }
export default AnxietyQuestion