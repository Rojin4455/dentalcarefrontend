import React from 'react'
import { AlertCircle, CheckCircle } from 'lucide-react'

function EmergencyQuestion({ answer, onSelect }) {
  return (
    <div className="max-w-4xl mx-auto mb-12">
  {/* Material Design typography - larger heading with lighter weight */}
  <h2 className="text-3xl font-normal text-gray-900 mb-4">Do you have a dental emergency?</h2>
  <p className="text-lg text-gray-600 mb-10">Let us know if you need urgent dental care</p>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Material Card 1 - with elevation and more pronounced selection state */}
    <div 
      onClick={() => onSelect('Yes')}
      className={`
        ${answer === 'Yes' 
          ? 'bg-[#f0f5ff] border-[#7eb0ed] shadow-lg transform scale-[1.02]' 
          : 'bg-white border-[#7eb0ed] hover:shadow-md hover:transform hover:scale-[1.01]'} 
        border rounded-xl p-8 cursor-pointer transition-all duration-200 flex items-center
        shadow-sm hover:shadow
      `}
      role="button"
      aria-pressed={answer === 'Yes'}
    >
      {/* Larger, more prominent icon */}
      <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mr-5">
        <AlertCircle size={28} className="text-red-600" />
      </div>
      <div>
        <h3 className="font-medium text-xl mb-2">Yes – I have an urgent issue</h3>
        <p className="text-gray-600 text-base">Pain, swelling, broken tooth, etc.</p>
      </div>
    </div>
    
    {/* Material Card 2 */}
    <div 
      onClick={() => onSelect('No')}
      className={`
        ${answer === 'No' 
          ? 'bg-[#f0f5ff] border-[#7eb0ed] shadow-lg transform scale-[1.02]' 
          : 'bg-white border-[#7eb0ed] hover:shadow-md hover:transform hover:scale-[1.01]'} 
        border rounded-xl p-8 cursor-pointer transition-all duration-200 flex items-center
        shadow-sm hover:shadow
      `}
      role="button"
      aria-pressed={answer === 'No'}
    >
      {/* Larger, more prominent icon */}
      <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mr-5">
        <CheckCircle size={28} className="text-green-600" />
      </div>
      <div>
        <h3 className="font-medium text-xl mb-2">No - I just need a new dentist</h3>
        <p className="text-gray-600 text-base">Regular check-up or non-urgent care</p>
      </div>
    </div>
  </div>
</div>

  );
}

export default EmergencyQuestion