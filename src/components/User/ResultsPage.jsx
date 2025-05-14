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
              `${BASE_API_URL}/api/admin/clinics/nearby/?lat=${location.lat}&lng=${location.lng}`
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
      <div className="pt-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Recommended Dental Clinics Near {location.location}</h2>
        <p className="text-gray-600 mb-6">Based on your preferences, we found {clinics.length} clinics that match your needs</p>
        
        <div className="max-w-7xl mx-auto px-6 py-8">
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    {/* Left column: Clinic cards */}
    <div className="lg:col-span-2 space-y-8">
      {clinics.map((clinic) => (
        <ClinicCard key={clinic.id} clinic={clinic} answers={answers} />
      ))}
    </div>

    {/* Right column: Map */}
    <div className="lg:col-span-1">
      <div className="sticky top-4">
        <Map clinics={clinics} location={location} />
      </div>
    </div>
  </div>
</div>


      </div>
    );
  }

export default ResultsPage