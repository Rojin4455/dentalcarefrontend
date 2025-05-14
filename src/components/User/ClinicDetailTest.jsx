import { useState } from "react"
import { MapPin, Star, Heart } from "lucide-react"
import { useNavigate } from "react-router-dom"

function ClinicBookingCard({ clinic }) {
  const navigate = useNavigate()
  const [isFavorite, setIsFavorite] = useState(false)

  // Format the schedule for display
  const formatWeekSchedule = (schedule) => {
    if (!schedule || !Array.isArray(schedule)) return []

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const today = new Date()
    const currentDay = today.getDay() // 0 = Sunday, 1 = Monday, etc.

    // Reorder days to start from today
    const reorderedDays = [...days.slice(currentDay), ...days.slice(0, currentDay)]

    // Create a map of day abbreviations to full day names
    const dayMap = {
      Sun: "Sunday",
      Mon: "Monday",
      Tue: "Tuesday",
      Wed: "Wednesday",
      Thu: "Thursday",
      Fri: "Friday",
      Sat: "Saturday",
    }

    // Map the schedule to the reordered days
    return reorderedDays.map((day) => {
      const fullDay = dayMap[day]
      const daySchedule = schedule.find((s) => s.day === fullDay)

      // Calculate the date for this day
      const date = new Date(today)
      const dayDiff = reorderedDays.indexOf(day)
      date.setDate(today.getDate() + dayDiff)

      return {
        day,
        date: date.getDate(),
        month: date.toLocaleString("default", { month: "short" }),
        available: daySchedule ? true : false,
        appointments: Math.floor(Math.random() * 15) + 1, // Random number of appointments for demo
      }
    })
  }

  const weekSchedule = formatWeekSchedule(clinic.schedule)

  // Get available time slots for a specific day
  const getTimeSlots = (day) => {
    const fullDayMap = {
      Sun: "Sunday",
      Mon: "Monday",
      Tue: "Tuesday",
      Wed: "Wednesday",
      Thu: "Thursday",
      Fri: "Friday",
      Sat: "Saturday",
    }

    const fullDay = fullDayMap[day]
    const daySchedule = clinic.schedule.find((s) => s.day === fullDay)

    if (!daySchedule) return []

    // Generate time slots between open and close times
    const slots = []
    const [openHour, openMinute] = daySchedule.open.split(":").map(Number)
    const [closeHour, closeMinute] = daySchedule.close.split(":").map(Number)

    let currentHour = openHour

    while (currentHour < closeHour) {
      slots.push(`${currentHour}:00 ${currentHour >= 12 ? "pm" : "am"}`)
      slots.push(`${currentHour}:30 ${currentHour >= 12 ? "pm" : "am"}`)
      currentHour++
    }

    return slots
  }

  const [selectedDay, setSelectedDay] = useState("Tue")
  const timeSlots = getTimeSlots(selectedDay)

  return (
    <div className="bg-white rounded-xl border overflow-hidden shadow-md">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 font-bold mr-3">
              {clinic.id || 1}
            </div>
            <div>
              <div className="text-orange-500 uppercase text-xs font-bold tracking-wider">SUPER PRACTICE</div>
              <h3 className="text-2xl font-bold">{clinic.name}</h3>
              <div className="flex items-center mt-1">
                <MapPin size={14} className="text-gray-500 mr-1" />
                <span className="text-gray-600 text-sm">{clinic.address || "Theater District"}</span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-gray-600 text-sm">{clinic.distance || "3.3"}mi</span>
              </div>
              <div className="flex items-center mt-1">
                <Star size={14} className="text-yellow-500 mr-1" />
                <span className="font-medium">{clinic.rating || "4.9"}</span>
                <span className="text-gray-500 ml-1">({clinic.reviews || "65"} reviews)</span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-gray-600 text-sm">Excellence in Patient Care</span>
              </div>
            </div>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-100" onClick={() => setIsFavorite(!isFavorite)}>
            <Heart size={24} className={`${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button className="text-gray-500 hover:text-gray-700">
            <span className="sr-only">Previous</span>← Previous
          </button>

          <div className="flex space-x-2 overflow-x-auto py-2">
            {weekSchedule.map((day, index) => (
              <button
                key={index}
                className={`flex-shrink-0 flex flex-col items-center p-3 rounded-lg border ${
                  selectedDay === day.day
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-white hover:bg-gray-50 border-gray-200"
                }`}
                onClick={() => setSelectedDay(day.day)}
                disabled={!day.available}
              >
                <span className={`text-sm ${selectedDay === day.day ? "text-white" : "text-gray-500"}`}>{day.day}</span>
                <span className="font-medium">
                  {day.month} {day.date}
                </span>
                <span className={`text-xs mt-1 ${selectedDay === day.day ? "text-white" : "text-gray-500"}`}>
                  {day.available ? `${day.appointments} appts` : "No appts"}
                </span>
              </button>
            ))}
          </div>

          <button className="text-gray-500 hover:text-gray-700">
            <span className="sr-only">Next</span>
            Next →
          </button>
        </div>

        <div className="mt-4">
          <h4 className="font-medium mb-3">Request a time on {selectedDay}, May 13th</h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {timeSlots.slice(0, 5).map((time, index) => (
              <button
                key={index}
                className="py-3 px-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg text-sm font-medium transition-colors"
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t pt-4">
          <div className="flex items-center text-gray-600">
            <svg
              className="w-4 h-4 mr-1 text-gray-500"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 5L19 8L22 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M19 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path
                d="M13 17L16 20L19 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M16 20V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 8H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 12H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 16H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-sm">13 people booked in the past month</span>
          </div>

          <div className="flex space-x-2">
            <button className="border border-gray-300 rounded-full p-2 hover:bg-gray-50">
              <Heart size={20} className="text-gray-500" />
            </button>
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

export default ClinicBookingCard