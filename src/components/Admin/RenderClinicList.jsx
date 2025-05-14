import React from "react";
import { MapPin, Star, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "sonner";

const RenderClinicsList = ({ handleAddNewClinic, clinics, handleEditClinic, GOOGLE_API_KEY }) => {
  const navigate = useNavigate();

  const handleDeleteClinic = async (clinic) => {
    try{
    const response = await axiosInstance.delete(`api/admin/clinics/${clinic.id}/`)
    if(response.status === 204){
      toast.success("clinic deleted")
      console.log("success: ", response)
    }else{
      toast.error("something went wrong")
      console.error("error: ", response)
    }
  }catch(error){
    console.error("error: ", error)
    toast.error("something went wrong")
  }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Clinics</h2>
        <button 
          onClick={handleAddNewClinic}
          className=" px-4 py-2 rounded-md button transition-colors"
        >
          Add New Clinic
        </button>
      </div>
      {clinics.map((clinic) => (
        <div key={clinic.id} className="bg-white rounded-xl border overflow-hidden shadow-md">
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
                    <span className="text-gray-600 text-sm">{clinic.address || "No address provided"}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <Star size={14} className="text-yellow-500 mr-1" />
                    <span className="font-medium">{clinic.rating || "N/A"}</span>
                    <span className="text-gray-500 ml-1">({clinic.reviews?.length || 0} reviews)</span>
                    {clinic.phone_number && (
                      <>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-gray-600 text-sm">{clinic.phone_number}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              {/* <button className="p-2 rounded-full hover:bg-gray-100">
                <Heart size={24} className="text-gray-400" />
              </button> */}
            </div>

            {/* Images */}
            {clinic.images && clinic.images.length > 0 && (
              <div className="mt-4 flex space-x-2 overflow-x-auto py-2">
                {clinic.images.map((img) => (
                  
                  <img
                  key={img.id}
                  src={`${img.image_url}&key=${GOOGLE_API_KEY}`}
                  alt="Clinic"
                  className="w-40 h-28 object-cover rounded-lg border"
                  />
                ))}
              </div>
            )}

            {/* Description */}
            <p className="mt-3 text-gray-700 text-sm">{clinic.description}</p>

            {/* Business Hours */}
            <div className="mt-4">
              <strong className="block text-sm font-medium mb-1 text-gray-700">Business Hours:</strong>
              <ul className="text-sm text-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                {clinic.business_hours.map((hour) => (
                  <li key={hour.id} className="flex justify-between">
                    <span>{hour.day_name}</span>
                    <span>
                      {hour.is_closed ? "Closed" : `${hour.opening_time} - ${hour.closing_time}`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-between border-t pt-4">
              {/* <div className="flex items-center text-gray-600 text-sm">
                <svg
                  className="w-4 h-4 mr-1 text-gray-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16 5L19 8L22 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M19 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M13 17L16 20L19 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M16 20V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 8H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 12H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 16H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>13 people booked in the past month</span>
              </div> */}

              <button
                onClick={() => handleDeleteClinic(clinic)}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-full font-medium"
              >
                Delete Clinic
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RenderClinicsList;
