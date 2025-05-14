import React from 'react'
import {Award, Clock, CreditCard, DollarSign, MapPin, Sparkles, Star} from 'lucide-react'

// Question 2: Important Factors
function FactorsQuestion({ selected, onSelect }) {
    const factors = [
      { id: 'rating', label: 'A high patient rating', icon: <Star size={20} className="text-yellow-500" /> },
      { id: 'location', label: 'A location close by', icon: <MapPin size={20} className="text-blue-500" /> },
      { id: 'modern', label: 'Modern spa-like practice', icon: <Sparkles size={20} className="text-purple-500" /> },
      { id: 'insurance', label: 'Accepts my insurance', icon: <CreditCard size={20} className="text-green-500" /> },
      { id: 'schedule', label: 'Fits my schedule', icon: <Clock size={20} className="text-orange-500" /> },
      { id: 'experience', label: 'Highly experienced dentist', icon: <Award size={20} className="text-red-500" /> },
      { id: 'cost', label: 'Cost of appointment', icon: <DollarSign size={20} className="text-emerald-500" /> }
    ];
  
    return (
      <div className="max-w-3xl mx-auto mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">The most important factors in choosing a dentist are...</h2>
        <p className="text-gray-600 mb-8">Select all that apply to you</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {factors.map((factor) => (
            <div 
              key={factor.id}
              onClick={() => onSelect(factor.id)}
              className={`${selected.includes(factor.id) ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-200' : 'bg-white hover:bg-gray-50'} 
                border rounded-xl p-4 cursor-pointer transition-all`}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  {factor.icon}
                </div>
                <span className="font-medium">{factor.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  

export default FactorsQuestion