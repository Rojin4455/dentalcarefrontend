import React, { useEffect, useState } from 'react'
import ClinicCard from './ClinicCard';
import axiosInstance from '../../api/axiosInstance';
import Map from './Map';

function ResultsPage({ location, answers }) {

    console.log("herere results page")

    const BASE_API_URL = import.meta.env.VITE_BASE_API_URL
    const [clinics, setClinics] = useState([])

    


    useEffect(() => {
        const fetchClinics = async () => {
          try {
            const response = await axiosInstance.get(
              `${BASE_API_URL}api/admin/clinics/nearby/?lat=${location.lat}&lng=${location.lng}`
            );
            console.log("Nearby clinics:", response.data);
            setClinics(response.data)
          } catch (error) {
            console.error("Error fetching nearby clinics:", error);
          }
        };
      
        if (location?.lat && location?.lng) {
          fetchClinics();
        }
      }, [location]);


  
    return (
      <div className="pt-4 px-4 sm:px-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
        Clinics Near {location.location}
      </h2>
      <p className="text-sm sm:text-base text-gray-600 mb-4">
        Based on your preferences, we found {clinics.length} clinics
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Cards */}
        <div className="lg:col-span-2 space-y-6">
          {clinics.map((clinic) => (
            <ClinicCard key={clinic.id} clinic={clinic} answers={answers} />
          ))}
        </div>

        {/* Right: Map */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <Map clinics={clinics} location={location} />
          </div>
        </div>
      </div>
    </div>
    );
  }

export default ResultsPage