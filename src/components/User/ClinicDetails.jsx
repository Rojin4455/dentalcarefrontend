"use client"

import { useState } from "react"
import { MapPin, Phone, Globe, Clock, Star, ChevronLeft, Calendar, ArrowUpRight,X } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import ClinicMap from "./ClinicMap"

export default function ClinicDetails() {
  const [activeTab, setActiveTab] = useState("info")
  const navigate = useNavigate()

  // In a real app, this would come from useLocation
  const { state } = useLocation();
  const clinic = state?.clinic;

  const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY
  const mostHelpfulReview = clinic.reviews.reduce((prev, current) => (prev.rating > current.rating ? prev : current))


  const formatWeekSchedule = (businessHours) => {
    if (!businessHours || !Array.isArray(businessHours)) return []

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const today = new Date()
    const currentDay = today.getDay() // 0 is Sunday, 1 is Monday, etc.

    // Reorder days so today is first
    const reorderedDays = [...days.slice(currentDay), ...days.slice(0, currentDay)]

    return reorderedDays.map((day, index) => {
      // Find the corresponding business hour entry
      const dayIndex = (currentDay + index) % 7
      const daySchedule = businessHours.find(hour => hour.day === dayIndex)

      // Calculate date for this day
      const date = new Date(today)
      date.setDate(today.getDate() + index)

      return {
        day,
        date: date.getDate(),
        month: date.toLocaleString("default", { month: "short" }),
        available: daySchedule && !daySchedule.is_closed,
        appointments: Math.floor(Math.random() * 15) + 1, // Random appointments for demo
      }
    })
  }

  const weekSchedule = formatWeekSchedule(clinic.business_hours)


  // Format time from "HH:MM:SS" to "H:MM AM/PM"
  const formatTime = (timeString) => {
    if (!timeString) return "Closed"

    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours, 10)
    const ampm = hour >= 12 ? "PM" : "AM"
    const formattedHour = hour % 12 || 12

    return `${formattedHour}:${minutes} ${ampm}`
  }

  // Generate calendar days

  const getShortDayName = (date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    return days[date.getDay()]
  }

  const today = new Date()
  const [selectedDay, setSelectedDay] = useState(getShortDayName(today))
  


  const getTimeSlots = (dayAbbr) => {
    // Map abbreviated day to full day index
    const dayMap = { "Sun": 0, "Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6 }
    const dayIndex = dayMap[dayAbbr]
    
    const daySchedule = clinic.business_hours?.find(hour => hour.day === dayIndex)

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

  const timeSlots = getTimeSlots(selectedDay)

  // Generate time slots
  // const timeSlots = ["8:00 am", "9:00 am", "10:00 am", "11:00 am", "12:00 pm", "1:00 pm", "3:00 pm", "4:00 pm"]

  const handleGoBack = () => {
    // In a real app: navigate(-1);
    console.log("Go back")
    navigate("/clinic-results")
  }


  const [showReminder, setShowReminder] = useState(true);


  const handleCloseReminder = () => {
    setShowReminder(false);
  };

  return (
    <div className="max-w-full mx-auto bg-white">


{showReminder && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
    <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-2xl text-center relative animate-fade-in">
      <button
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        onClick={handleCloseReminder}
      >
        <X size={20} />
      </button>

      <img
        src="https://cdn-icons-png.flaticon.com/512/3050/3050525.png"
        alt="Reward"
        className="w-16 h-16 mx-auto mb-4"
      />

      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Get a $50 Prepaid Mastercard!
      </h2>

      <p className="text-sm text-gray-600">
        After your visit to this clinic, you'll receive a $50 reward. It's our way of saying thanks for taking care of your smile!
      </p>

      <button
        onClick={handleCloseReminder}
        className="mt-4 bg-[#7eb0ed] text-white px-4 py-2 rounded-full hover:bg-[#71a5e4] transition"
      >
        Got it!
      </button>
    </div>
  </div>
)}


      {/* Map Section */}
      <div className="relative h-64 bg-white rounded-lg overflow-hidden">
  <ClinicMap latitude={clinic.latitude} longitude={clinic.longitude} />

  <button onClick={handleGoBack} className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md">
    <ChevronLeft className="h-5 w-5 text-gray-700" />
  </button>
</div>




      {/* Clinic Info Section */}
      <div className="p-7 md:p-12">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{clinic.name}</h1>
            <p className="text-gray-600 mt-1">{clinic.address}</p>

            <div className="flex items-center mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${star <= Math.round(clinic.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="ml-2 text-2xl font-semibold text-gray-700">{clinic.rating}</span>
              <span className="text-gray-500 ml-1">/5</span>
              <span className="ml-2 text-gray-500">{clinic.reviews.length} Reviews</span>
            </div>

            <div className="mt-4 inline-flex items-center px-3 py-1 bg-[#f5f7ff] text-[#79b1ed] rounded-full">
              <Star className="h-4 w-4 mr-1 fill-[#79b1ed] text-[#79b1ed]" />
              <span className="text-sm font-medium">Excellence in Patient Care</span>
            </div>
          </div>

          <div className="flex -space-x-2">
            {clinic.images.slice(0, 3).map((image, index) => (
              <div key={image.id} className="w-12 h-12 rounded-full border-2 border-white overflow-hidden">
                <img
                  src={`${image.image_url}&key=${GOOGLE_API_KEY}` || "/placeholder.svg?height=50&width=50"}
                  alt={`Staff ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Most Helpful Review */}
        <div className="mt-6 bg-gray-50  p-4 rounded-lg relative">
          <div className="text-gray-500 mb-2 font-medium">MOST HELPFUL REVIEW</div>
          <div className="text-gray-700">{mostHelpfulReview.text}</div>
          <div className="absolute top-4 right-4 text-gray-300 text-5xl">"</div>
          <div className="absolute bottom-4 right-4 text-gray-300 text-5xl">"</div>
        </div>

        {/* Appointment Section */}
        <div className="mt-6">
          <div className="bg-gray-50  p-4 rounded-lg">
            

            {/* Calendar */}
            <div className="mt-6 space-y-6">

  {/* Day Selector */}
  <div>
    <h4 className="text-base font-semibold mb-2 text-gray-700">Select a Day</h4>
    <div className="flex space-x-2 overflow-x-auto pb-1">
      {weekSchedule.map((day, index) => {
        const isSelected = selectedDay === day.day;
        const isAvailable = day.available;

        return (
          <button
            key={index}
            className={`flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-lg border transition-all duration-200 min-w-[72px]
              ${isAvailable
                ? isSelected
                  ? "bg-[#9fdef5] text-white border-[#7eb0ed]"
                  : "bg-white hover:bg-gray-50  border-gray-200 cursor-pointer"
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
  </div>

  {/* Time Selector */}
  <div>
    <h4 className="text-base font-semibold mb-3 text-gray-700">
      Request a time on {selectedDay}, May 13th
    </h4>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {timeSlots.length > 0 ? (
        timeSlots.slice(0, 5).map((time, index) => (
          <button
            key={index}
            className="py-2 px-3 bg-[#e6f2ff] hover:bg-[#9fdef5] text-[#7bb0ed] rounded-lg text-sm font-medium transition-colors"
          >
            {time}
          </button>
        ))
      ) : (
        <p className="col-span-full text-gray-500 text-sm">
          No appointments available for this day
        </p>
      )}
    </div>
  </div>


</div>

          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 border-t">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("info")}
              className={`py-4 px-6 font-medium ${
                activeTab === "info" ? "text-[#7bb0ed] border-b-2 border-[#7bb0ed]" : "text-gray-500"
              }`}
            >
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Need to know
              </div>
            </button>

            <button
              onClick={() => setActiveTab("office")}
              className={`py-4 px-6 font-medium ${
                activeTab === "office" ? "text-[#7bb0ed] border-b-2 border-[#7bb0ed]" : "text-gray-500"
              }`}
            >
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                Office
              </div>
            </button>

            

            <button
              onClick={() => setActiveTab("reviews")}
              className={`py-4 px-6 font-medium ${
                activeTab === "reviews" ? "text-[#7bb0ed] border-b-2 border-[#7bb0ed]" : "text-gray-500"
              }`}
            >
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Reviews
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="py-4">
            {activeTab === "info" && (
              <div>
                <h3 className="font-medium text-gray-800 mb-2">About {clinic.name}</h3>
                <p className="text-gray-600 mb-4">{clinic.description}</p>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-800">Address</h4>
                      <p className="text-gray-600">{clinic.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-800">Phone</h4>
                      <p className="text-gray-600">{clinic.phone_number}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Globe className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-800">Website</h4>
                      <a
                        href={clinic.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#7bb0ed] hover:underline"
                      >
                        {clinic.website.replace("https://www.", "")}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-800">Business Hours</h4>
                      <div className="space-y-1 mt-1">
                        {clinic.business_hours.map((hours) => (
                          <div key={hours.id} className="grid grid-cols-2 text-gray-600">
                            <span>{hours.day_name}</span>
                            <span>
                              {hours.opening_time
                                ? `${formatTime(hours.opening_time)} - ${formatTime(hours.closing_time)}`
                                : "Closed"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${star <= Math.round(clinic.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-xl font-semibold text-gray-700">{clinic.rating}</span>
                  <span className="text-gray-500 ml-1">/5</span>
                  <span className="ml-2 text-gray-500">({clinic.reviews.length} reviews)</span>
                </div>

                {clinic.reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4">
                    <div className="flex items-center mb-2">
                      
                      <div>
                        <h4 className="font-medium text-gray-800">{review.author_name}</h4>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${star <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">{review.text}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "office" && (
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Office Information</h3>
                <p className="text-gray-600 mb-4">
                  {clinic.name} is located at {clinic.address}. Our modern facility is equipped with the latest dental
                  technology to provide you with the best care possible.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                  {clinic.images.map((image) => (
                    <div key={image.id} className="rounded-lg overflow-hidden h-40">
                      <img
                        src={`${image.image_url}&key=${GOOGLE_API_KEY}` || "/placeholder.svg?height=160&width=200"}
                        alt={clinic.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            
          </div>
        </div>
      </div>
    </div>
  )
}
