import { useState } from "react"
import { MapPin, Star, Heart } from "lucide-react"
import { useNavigate } from "react-router-dom"

function ClinicCard({ clinic, answers }) {

  console.log("clinic detailssss: ", clinic)
  const navigate = useNavigate()
  const [isFavorite, setIsFavorite] = useState(false)

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
    <div className="bg-white rounded-xl border overflow-hidden shadow-md">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            {/* <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 font-bold mr-3">
              {clinic.id || 1}
            </div> */}
            <div>
              <div className="text-orange-500 uppercase text-xs font-bold tracking-wider">SUPER PRACTICE</div>
              <h3 className="text-2xl font-bold">{clinic.name}</h3>
              <div className="flex items-center mt-1">
                <MapPin size={14} className="text-gray-500 mr-1" />
                <span className="text-gray-600 text-sm">{clinic.address || "Theater District"}</span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-gray-600 text-sm">{distance}km</span>
              </div>
              <div className="flex items-center mt-1">
                <Star size={14} className="text-yellow-500 mr-1" />
                <span className="font-medium">{clinic.rating || "4.9"}</span>
                {/* <span className="text-gray-500 ml-1">({reviewCount} reviews)</span> */}
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-gray-600 text-sm">{clinic.description ? clinic.description.split('.')[0] : "Excellence in Patient Care"}</span>
              </div>
            </div>
          </div>
          {/* <button className="p-2 rounded-full hover:bg-gray-100" onClick={() => setIsFavorite(!isFavorite)}>
            <Heart size={24} className={`${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
          </button> */}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button className="text-gray-500 hover:text-gray-700">
            <span className="sr-only">Previous</span>← Previous
          </button>

          <div className="flex space-x-2 overflow-x-auto py-2">
          {weekSchedule.map((day, index) => {
  const isSelected = selectedDay === day.day;
  const isAvailable = day.available;

  return (
    <button
      key={index}
      className={`flex-shrink-0 flex flex-col items-center p-3 rounded-lg border transition-all duration-200
        ${isAvailable
          ? isSelected
            ? "bg-[#7eb0ed] text-white border-[#7eb0ed]"
            : "bg-white hover:bg-gray-50 border-gray-200 cursor-pointer"
          : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60"
        }`}
      onClick={() => isAvailable && setSelectedDay(day.day)}
      disabled={!isAvailable}
    >
      <span className={`text-sm ${isSelected && isAvailable ? "text-white" : isAvailable ? "text-gray-500" : "text-gray-400"}`}>
        {day.day}
      </span>
      <span className={`font-medium ${!isAvailable ? "text-gray-400" : ""}`}>
        {day.month} {day.date}
      </span>
    </button>
  );
})}

          </div>

          <button className="text-gray-500 hover:text-gray-700">
            <span className="sr-only">Next</span>
            Next →
          </button>
        </div>

        <div className="mt-4">
          <h4 className="font-medium mb-3">Request a time on {selectedDay}, May 13th</h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {timeSlots.length > 0 ? (
              timeSlots.slice(0, 5).map((time, index) => (
                <button
                  key={index}
                  className="py-3 px-2 bg-[#e6f2ff] hover:bg-[#7eb0ed] text-[#7eb0ed] hover:text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {time}
                </button>
              ))
            ) : (
              <p className="col-span-full text-gray-500 text-sm">No appointments available for this day</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t pt-4">
          <div className="flex items-center text-gray-600">
          </div>

          <div className="flex space-x-2">
            
            <button
              onClick={() => navigate("/clinic-details", { state: { clinic } })}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-full font-medium"
            >
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClinicCard