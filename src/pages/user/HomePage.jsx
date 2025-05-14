import React,{useState, useRef} from 'react'
import {Calendar, CheckCircle, MapPin, Search} from 'lucide-react'
import { Autocomplete, useLoadScript } from '@react-google-maps/api';

function HomePage({ onLocationSelect }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
  
    // Mock location search functionality
    const handleSearch = (term) => {
      setSearchTerm(term);
      if (term.length > 2) {
        // Mock API results
        setSuggestions([
          'San Francisco, CA',
          'San Diego, CA',
          'San Jose, CA',
          'San Antonio, TX'
        ].filter(loc => loc.toLowerCase().includes(term.toLowerCase())));
      } else {
        setSuggestions([]);
      }
    };




    const [autocomplete, setAutocomplete] = useState(null);
    const inputRef = useRef();
  
    const { isLoaded } = useLoadScript({
      googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
      libraries: ['places'],
    });
  
    const onLoad = (autoC) => {
      setAutocomplete(autoC);
    };
  
    const onPlaceChanged = () => {
      if (autocomplete !== null) {
        const place = autocomplete.getPlace();
        const location = place.formatted_address || place.name;
        const lat = place.geometry?.location?.lat();
        const lng = place.geometry?.location?.lng();
  
        if (onLocationSelect) {
          onLocationSelect({
            location,
            lat,
            lng,
            placeId: place.place_id,
          });
        }
      }
    };
console.log("autocomplete", autocomplete)
  
    if (!isLoaded) return null;
  
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Find Your Perfect Dentist</h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl">
          Personalized recommendations based on your preferences and location
        </p>
        
        {/* Search bar */}
        <div className="w-full max-w-md mb-8 relative">
  <div className="flex bg-white rounded-full shadow-lg overflow-hidden">
    <div className="flex items-center pl-4 text-gray-400">
      <MapPin size={20} />
    </div>
    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged} sx={{ width: 200 }}>
      <input
        type="text"
        ref={inputRef}
        placeholder="Enter your location"
        className="flex-1 py-4 px-4 outline-none text-gray-700"
      />
    </Autocomplete>
    {/* <button
      className="flex items-center justify-center bg-blue-600 text-white px-5 py-4 hover:bg-blue-700 transition-colors rounded-r-full"
    >
      <Search size={20} />
    </button> */}
  </div>
</div>


        
        {/* Features section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full max-w-4xl mt-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <MapPin size={24} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Find Nearby Dentists</h3>
            <p className="text-gray-600">Discover top-rated dental clinics close to your location.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Personalized Matches</h3>
            <p className="text-gray-600">Get recommendations based on your preferences and needs.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Calendar size={24} className="text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Easy Scheduling</h3>
            <p className="text-gray-600">Book appointments that fit your schedule with a few clicks.</p>
          </div>
        </div>
      </div>
    );
  }
export default HomePage