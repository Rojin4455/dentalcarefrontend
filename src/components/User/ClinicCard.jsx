import { useState } from "react"
import { MapPin, Star, Heart, Phone } from "lucide-react"
import { useNavigate } from "react-router-dom"

function ClinicCard({ clinic, answers }) {

  console.log("clinic detailssss: ", clinic)
  const navigate = useNavigate()
  const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY


  // Format the business hours for display
  const formatWeekSchedule = (businessHours) => {
    if (!businessHours || !Array.isArray(businessHours)) return []

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const today = new Date()
    const currentDay = today.getDay() // 0 is Sunday, 1 is Monday, etc.

    // Reorder days so today is first
    const reorderedDays = [...days.slice(currentDay), ...days.slice(0, currentDay)]

    return reorderedDays.map((day, index) => {
      // Find the corresponding business hour entry
      const dayIndex = (currentDay + index-1) % 7
      const daySchedule = businessHours.find(hour => hour.day === dayIndex)

      // Calculate date for this day
      const date = new Date(today)
      date.setDate(today.getDate() + index)

      return {
        day,
        date: date.getDate(),
        month: date.toLocaleString("default", { month: "short" }),
        available: daySchedule && !daySchedule.is_closed,
        appointments: Math.floor(Math.random() * 15) + 1,
      }
    })
  }

  const weekSchedule = formatWeekSchedule(clinic.business_hours)

  // Get available time slots for a specific day
  const getTimeSlots = (dayAbbr) => {
    // Map abbreviated day to full day index
    const dayMap = { "Sun": 0, "Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6 }
    const dayIndex = dayMap[dayAbbr]
    
    const daySchedule = clinic.business_hours?.find(hour => hour.day === dayIndex-1)

    if (!daySchedule || daySchedule.is_closed) return []

    // Generate time slots between opening and closing times
    const slots = []
    
    if (daySchedule.opening_time && daySchedule.closing_time) {
      const [openHour, openMinute] = daySchedule.opening_time.split(":").map(Number)
      const [closeHour, closeMinute] = daySchedule.closing_time.split(":").map(Number)

      let currentHour = openHour
      
      while (currentHour < closeHour) {
        const displayHour = currentHour > 12 ? currentHour - 12 : currentHour
        slots.push(`${displayHour}:00 ${currentHour >= 12 ? "pm" : "am"}`)
        slots.push(`${displayHour}:30 ${currentHour >= 12 ? "pm" : "am"}`)
        currentHour++
      }
    }

    return slots
  }


  const handlePhoneClick = (e) => {
    e.preventDefault();
    
    // console.log('🔥 Phone button clicked!');
    // console.log('📱 Phone number:', clinic.phone_number);
    
    // Check if gtag is available
    if (typeof window.gtag === 'function') {
      // console.log('✅ Google gtag is available');
      
      // Track the conversion
      window.gtag('event', 'conversion', {
        'send_to': 'AW-17108722657/SMrvCOS5xtUaEOHHid4_',
        'value': 1.0,
        'currency': 'CAD'
      });
      
      // console.log('📊 Conversion event sent to Google Ads');
      // console.log('📋 Conversion details:', {
      //   send_to: 'AW-17108722657/SMrvCOS5xtUaEOHHid4_',
      //   value: 1.0,
      //   currency: 'CAD'
      // });
    } else {
      // console.error('❌ Google gtag is NOT available');
      console.log('🔍 Available window properties:', Object.keys(window).filter(key => key.includes('gtag') || key.includes('google')));
    }
    
    // Small delay to ensure tracking fires before phone call
    setTimeout(() => {
      console.log('📞 Initiating phone call...');
      window.location.href = `tel:${clinic.phone_number}`;
    }, 100);
  };

  // Get short day name from date
  const getShortDayName = (date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    return days[date.getDay()]
  }

  const today = new Date()
  const [selectedDay, setSelectedDay] = useState(getShortDayName(today))
  const timeSlots = getTimeSlots(selectedDay)

  // Get distance in miles (placeholder for now)
  const distance = clinic.distance ? clinic.distance.toFixed(1) : "3.3"

  // Get number of reviews
  const reviewCount = clinic.reviews ? clinic.reviews.length : 0

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 max-w-4xl mx-auto">
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Main Info */}
          <div className="flex-1 space-y-4">
            {/* Clinic Name */}
            <div className="space-y-3">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                {clinic.name}
              </h3>
              
              {/* Location & Distance Row */}
              <div className="flex flex-wrap items-center gap-3 text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                  <span className="text-sm font-medium">{clinic.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-300 rounded-full hidden sm:block"></span>
                  <span className="text-sm font-semibold text-[#64a4f3] bg-blue-50 px-2 py-1 rounded-full">
                    {distance}km away
                  </span>
                </div>
              </div>

              {/* Rating & Description Row */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-gray-900 text-sm">{clinic.rating}</span>
                    {/* <span className="text-xs text-gray-500">/5</span> */}
                  </div>
                  <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                    Excellent Rating
                  </span>
                </div>
                
                {clinic.description && (
                  <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                    {clinic.description.split('.')[0] || "Excellence in Patient Care"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Staff Images */}
          <div className="flex items-start justify-end">
            <div className="flex flex-col items-end gap-2">
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Our Team
              </span>
              <div className="flex -space-x-2">
                {clinic.images?.slice(0, 3).map((image, index) => (
                  <div 
                    key={image.id} 
                    className="w-12 h-12 rounded-full border-3 border-white shadow-lg overflow-hidden bg-gradient-to-br from-[#64a4f3] to-[#4a90e2]"
                    style={{ zIndex: 10 - index }}
                  >
                    <img
                      src={`${image.image_url}&key=${GOOGLE_API_KEY}` || "/placeholder.svg?height=50&width=50"}
                      alt={`Staff ${index + 1}`}
                      className="w-full h-full object-cover"
                      
                    />
                  </div>
                ))}
                {clinic.images && clinic.images.length > 3 && (
                  <div className="w-12 h-12 rounded-full border-3 border-white shadow-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-600">
                      +{clinic.images.length - 3}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Phone Number - Prominent Call-to-Action */}
        {clinic.phone_number && (
        <div className="bg-gradient-to-r from-[#64a4f3]/10 to-[#4a90e2]/10 rounded-xl p-4 border border-[#64a4f3]/20">
          <a 
            href={`tel:${clinic.phone_number}`}
            onClick={handlePhoneClick}
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-[#64a4f3] to-[#4a90e2] hover:from-[#5a94e3] hover:to-[#4080d2] text-white px-6 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 group"
          >
            <Phone size={20} className="group-hover:animate-pulse" />
            <span>Call Now: {clinic.phone_number}</span>
          </a>
        </div>
      )}

        {/* Action Buttons */}
        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              {/* <span>Available Today</span> */}
            </div>
            {/* <span className="hidden sm:block">•</span> */}
            <span>Quick Response</span>
          </div>
          
          <button
            onClick={() => navigate("/clinic-details", { state: { clinic } })}
            className="bg-white border border-[#64a4f3]/30 hover:bg-[#64a4f3]/5 hover:border-[#64a4f3] text-[#64a4f3] px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 hover:shadow-md group"
          >
            <span className="group-hover:mr-1 transition-all duration-200">View Full Profile</span>
            <span className="inline-block group-hover:translate-x-1 transition-transform duration-200">→</span>
          </button>
        </div>
      </div>
    </div>

  )
}

export default ClinicCard