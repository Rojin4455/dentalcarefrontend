import React, { useState, useRef, useEffect } from 'react'
import { X, MapPin, Pencil, Phone, Globe, Star, Clock } from 'lucide-react'
import { GoogleMap, MarkerF, useLoadScript, Autocomplete } from "@react-google-maps/api";
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'sonner'
import axios from 'axios';

const RenderClinicForm = ({ setSelectedClinic, selectedClinic, handleCancelEdit, days, formMode }) => {
    const [images, setImages] = useState(selectedClinic.images || []);
    const [errors, setErrors] = useState({});
    const BASE_API_URL = import.meta.env.VITE_BASE_API_URL
    const [locationData, setLocationData] = useState({})
    const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY
    const [autocomplete, setAutocomplete] = useState(null);
    const inputRef = useRef();




    const { isLoaded } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
        libraries: ["places"],
    });
    console.log("selected clinic data: ", selectedClinic)

    if (!isLoaded || !selectedClinic) return null;

    const onLoad = (autoC) => {
        setAutocomplete(autoC);
    };

    const onPlaceChanged = async () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            const location = place.formatted_address || place.name;
            const lat = place.geometry?.location?.lat();
            const lng = place.geometry?.location?.lng();

            setLocationData(prev => ({
                ...prev,
                location,
                lat,
                lng,
                placeId: place.place_id,
            }))

            // Fetch place details and populate form
            if (place.place_id) {
                try {
                    const response = await axiosInstance.get(`api/admin/place-details/?place_id=${place.place_id}`)
                    if (response.status === 200 && response.data.result) {
                        const placeData = response.data.result;
                        console.log("Place details received:", placeData);
                        
                        // Populate form with place data
                        populateFormWithPlaceData(placeData);
                    }
                } catch (error) {
                    console.error("Error fetching place details:", error);
                    toast.error("Failed to fetch place details");
                }
            }

            // Update location even if place details fetch fails
            setSelectedClinic(prev => ({
                ...prev,
                location,
                lat,
                lng,
                placeId: place.place_id,
            }));
        }
    };

    const populateFormWithPlaceData = (placeData) => {
        // Basic information
        setSelectedClinic(prev => ({
            ...prev,
            name: placeData.name || prev.name,
            location: placeData.formatted_address || prev.location,
            lat: placeData.geometry?.location?.lat || prev.lat,
            lng: placeData.geometry?.location?.lng || prev.lng,
            placeId: placeData.place_id || prev.placeId,
            // Additional fields
            phoneNumber: placeData.formatted_phone_number || prev.phoneNumber || '',
            website: placeData.website || prev.website || '',
            rating: placeData.rating || prev.rating || 0,
            totalReviews: placeData.user_ratings_total || prev.totalReviews || 0,
            reviews:placeData.reviews || [],
            // Map business types to description
            businessTypes: placeData.types || prev.businessTypes || [],
            // Add description based on business type if not already filled
            description: prev.description || generateDescriptionFromTypes(placeData.types, placeData.name),
        }));

        // Process and set opening hours
        if (placeData.opening_hours?.periods) {
            const schedule = processOpeningHours(placeData.opening_hours.periods);
            setSelectedClinic(prev => ({
                ...prev,
                schedule: schedule
            }));
        }

        // Process and set images
        if (placeData.photos && placeData.photos.length > 0) {
            const imageUrls = placeData.photos.slice(0, 6).map(photo => ({
                image_url: photo.html_attributions?.[0] || '',
                reference: photo.photo_reference || ''
            }));
            setImages(imageUrls);
            setSelectedClinic(prev => ({
                ...prev,
                images: imageUrls
            }));
        }
    };

    const processOpeningHours = (periods) => {
        const schedule = {
            Monday: { open: '', close: '' },
            Tuesday: { open: '', close: '' },
            Wednesday: { open: '', close: '' },
            Thursday: { open: '', close: '' },
            Friday: { open: '', close: '' },
            Saturday: { open: '', close: '' },
            Sunday: { open: '', close: '' }
        };

        const dayMap = {
            0: 'Sunday',
            1: 'Monday',
            2: 'Tuesday',
            3: 'Wednesday',
            4: 'Thursday',
            5: 'Friday',
            6: 'Saturday'
        };

        periods.forEach(period => {
            const dayName = dayMap[period.open.day];
            schedule[dayName] = {
                open: formatTime(period.open.time),
                close: period.close ? formatTime(period.close.time) : ''
            };
        });

        return schedule;
    };

    const formatTime = (time) => {
        if (!time) return '';
        const hours = time.substring(0, 2);
        const minutes = time.substring(2, 4);
        return `${hours}:${minutes}`;
    };

    const generateDescriptionFromTypes = (types, name) => {
        if (!types || types.length === 0) return '';
        
        // Filter relevant business types
        const relevantTypes = types.filter(type => 
            type !== 'point_of_interest' && 
            type !== 'establishment'
        );
        
        if (relevantTypes.includes('dentist')) {
            return `${name} is a professional dental clinic offering comprehensive dental care services.`;
        } else if (relevantTypes.includes('doctor')) {
            return `${name} is a medical facility providing healthcare services to patients.`;
        } else if (relevantTypes.includes('health')) {
            return `${name} is a health center dedicated to providing quality healthcare services.`;
        }
        
        return `${name} is a healthcare facility.`;
    };

    const handleDeleteImage = (index) => {
        const updated = [...images];
        updated.splice(index, 1);
        setImages(updated);
        setSelectedClinic((prev) => ({
            ...prev,
            images: updated,
        }));
    };

    const handleEditImage = (index) => {
        document.getElementById(`edit-image-${index}`).click();
    };

    const handleReplaceImage = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            const newUrl = URL.createObjectURL(file);
            const updated = [...images];
            updated[index] = { url: newUrl, file };
            setImages(updated);
            setSelectedClinic((prev) => ({
                ...prev,
                images: updated,
            }));
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const imageUrls = files.map((file) => URL.createObjectURL(file));
        setImages((prev) => [...prev, ...imageUrls]);
        
        setSelectedClinic((prev) => ({
            ...prev,
            imageFiles: [...(prev.imageFiles || []), ...files],
        }));
    };

    const handleOpenChange = (day, value) => {
        setSelectedClinic((prev) => ({
            ...prev,
            schedule: {
                ...prev.schedule,
                [day]: {
                    ...prev.schedule[day],
                    open: value,
                },
            },
        }));
        setErrors((prev) => ({ ...prev, [day]: null }));
    };

    const handleCloseChange = (day, value) => {
        const openTime = selectedClinic.schedule[day].open;
        if (openTime && value <= openTime) {
            setErrors((prev) => ({
                ...prev,
                [day]: "Closing time must be later than opening time.",
            }));
            return;
        }

        setErrors((prev) => ({ ...prev, [day]: null }));

        setSelectedClinic((prev) => ({
            ...prev,
            schedule: {
                ...prev.schedule,
                [day]: {
                    ...prev.schedule[day],
                    close: value,
                },
            },
        }));
    };

    const handleSubmitForm = async () => {
        if (formMode === "add") {
            handleAddClinic()
        } else {
            handleUpdateClinic()
        }
    }

    const handleAddClinic = async () => {

        const simplifiedReviews = selectedClinic.reviews.map((review) => ({
          author_name: review.author_name,
          author_photo_url: review.profile_photo_url, // mapping the correct field
          rating: review.rating,
          text: review.text,
        }));
        try {
            const formData = new FormData();
            formData.append("name", selectedClinic.name);
            formData.append("description", selectedClinic.description);
            formData.append("address", selectedClinic.location);
            formData.append("latitude", selectedClinic.lat);
            formData.append("longitude", selectedClinic.lng);
            formData.append("place_id", selectedClinic.placeId);
            formData.append("phone_number", selectedClinic.phoneNumber || '');
            formData.append("website", selectedClinic.website || '');
            formData.append("rating", selectedClinic.rating || 0);
            formData.append("total_reviews", selectedClinic.totalReviews || 0);
            formData.append("business_types", JSON.stringify(selectedClinic.businessTypes || []));
            formData.append("business_hours", JSON.stringify(selectedClinic.schedule));
            formData.append('reviews',JSON.stringify(simplifiedReviews))
            const transformedImages = images.map((img, idx) => {
              const image_url = img.reference
                ? getGooglePhotoUrl(img.reference)
                : img.image_url || img;
            
              return {
                image_file: null,              // assuming no file uploads here
                image_url: image_url,
                caption: img.caption || "",    // optional caption
                is_primary: idx === 0          // first image as primary (optional logic)
              };
            });

            formData.append('images', JSON.stringify(transformedImages));

            // // Append each image file
            // if (selectedClinic.imageFiles) {
            //     selectedClinic.imageFiles.forEach((file, index) => {
            //         formData.append("images", file);
            //     });
            // }

            const response = await axiosInstance.post(
                `${BASE_API_URL}api/admin/clinics/`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (response.status === 201) {
                console.log("success response :", response)
                toast.success("Clinic Created Successfully")
            } else {
                console.error("error response: ", response)
            }
        } catch (error) {
            console.error("something went wrong: ", error)
            toast.error("Failed to create clinic")
        }
    }

    const handleUpdateClinic = async () => {
      const simplifiedReviews = selectedClinic.reviews.map((review) => ({
        author_name: review.author_name,
        author_photo_url: review.profile_photo_url, // mapping the correct field
        rating: review.rating,
        text: review.text,
      }));

        try {
            const formData = new FormData();
            formData.append("name", selectedClinic.name);
            formData.append("description", selectedClinic.description);
            formData.append("address", selectedClinic.address);
            formData.append("latitude", selectedClinic.latitude);
            formData.append("longitude", selectedClinic.longitude)
            formData.append("place_id", selectedClinic.placeId);
            formData.append("phone_number", selectedClinic.phoneNumber || '');
            formData.append("website", selectedClinic.website || '');
            formData.append("rating", selectedClinic.rating || 0);
            formData.append("total_reviews", selectedClinic.totalReviews || 0);
            formData.append("business_types", JSON.stringify(selectedClinic.businessTypes || []));
            formData.append("schedule", JSON.stringify(selectedClinic.schedule));
            formData.append('reviews',JSON.stringify(simplifiedReviews))


            const transformedImages = images.map((img, idx) => {
              const image_url = img.reference
                ? getGooglePhotoUrl(img.reference)
                : img.image_url || img;
            
              return {
                image_file: null,              // assuming no file uploads here
                image_url: image_url,
                caption: img.caption || "",    // optional caption
                is_primary: idx === 0          // first image as primary (optional logic)
              };
            });

            formData.append('images', JSON.stringify(transformedImages));

            // Append each image file
            // if (selectedClinic.imageFiles) {
            //     selectedClinic.imageFiles.forEach((file, index) => {
            //         formData.append("images", file);
            //     });
            // }

            const response = await axiosInstance.put(
                `${BASE_API_URL}api/admin/clinics/${selectedClinic.id}/`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (response.status === 200) {
                console.log("success response :", response)
                toast.success("Clinic Updated Successfully")
            } else {
                console.error("error response: ", response)
            }
        } catch (error) {
            console.error("something went wrong: ", error)
            toast.error("Failed to update clinic")
        }
    }


    const getGooglePhotoUrl = (reference) => {
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photo_reference=${reference}`;
    };
    

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                    {formMode === 'add' ? 'Add New Clinic' : 'Edit Clinic'}
                </h2>
                <button
                    onClick={handleCancelEdit}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Name</label>
                        <input
                            type="text"
                            value={selectedClinic.name}
                            onChange={(e) => setSelectedClinic(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <div className="flex">
                            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                                <input
                                    type="text"
                                    ref={inputRef}
                                    className="w-full p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Search for location..."
                                    defaultValue={selectedClinic.location}
                                />
                            </Autocomplete>
                            <button className="bg-gray-100 border border-l-0 border-gray-300 px-3 rounded-r-md hover:bg-gray-200">
                                <MapPin size={18} className="text-gray-500" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Powered by Google Places API</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <div className="flex">
                            <input
                                type="text"
                                value={selectedClinic.phoneNumber || ''}
                                onChange={(e) => setSelectedClinic(prev => ({ ...prev, phoneNumber: e.target.value }))}
                                className="w-full p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter phone number"
                            />
                            <div className="bg-gray-100 border border-l-0 border-gray-300 px-3 rounded-r-md flex items-center">
                                <Phone size={18} className="text-gray-500" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                        <div className="flex">
                            <input
                                type="text"
                                value={selectedClinic.website || ''}
                                onChange={(e) => setSelectedClinic(prev => ({ ...prev, website: e.target.value }))}
                                className="w-full p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter website URL"
                            />
                            <div className="bg-gray-100 border border-l-0 border-gray-300 px-3 rounded-r-md flex items-center">
                                <Globe size={18} className="text-gray-500" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                        <div className="flex items-center">
                            <input
                                type="number"
                                value={selectedClinic.rating || 0}
                                onChange={(e) => setSelectedClinic(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
                                min="0"
                                max="5"
                                step="0.1"
                                className="w-24 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <Star size={18} className="text-yellow-500 ml-2" />
                            <span className="text-sm text-gray-500 ml-2">({selectedClinic.totalReviews || 0} reviews)</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Business Types</label>
                        <div className="text-sm text-gray-600">
                            {selectedClinic.businessTypes?.filter(type => 
                                type !== 'point_of_interest' && type !== 'establishment'
                            ).map(type => (
                                <span key={type} className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2 mb-2">
                                    {type.replace(/_/g, ' ')}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Images</label>
                    <div className="flex flex-wrap gap-4 mb-2">
                        {images.map((img, idx) => (
                          
                            <div key={idx} className="relative w-36 h-24 bg-gray-100 rounded-md overflow-hidden">
                              {/* {console.log("imgggg: ", img)} */}
                                <img
                                     src={img.reference ? `${getGooglePhotoUrl(img.reference)}&key=${GOOGLE_API_KEY}` : `${img.image_url}&key=${GOOGLE_API_KEY}` || img}
                                    alt={`Clinic ${idx}`}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-1 right-1 flex gap-1">
                                    <button
                                        onClick={() => handleEditImage(idx)}
                                        className="bg-white bg-opacity-75 p-1 rounded hover:bg-blue-200"
                                        title="Edit"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteImage(idx)}
                                        className="bg-white bg-opacity-75 p-1 rounded hover:bg-red-200"
                                        title="Delete"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>

                                {/* Hidden file input for editing */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleReplaceImage(e, idx)}
                                    className="hidden"
                                    id={`edit-image-${idx}`}
                                />
                            </div>
                        ))}
                    </div>

                    <label className="cursor-pointer bg-gray-100 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-200 text-sm inline-block">
                        Upload Images
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        value={selectedClinic.description}
                        onChange={(e) => setSelectedClinic(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full p-2 border border-gray-300 rounded-md h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter clinic description"
                    ></textarea>
                </div>

                <div>
                    <h3 className="text-md font-semibold text-gray-800 mb-3">Clinic Hours</h3>
                    <div className="bg-gray-50 p-5 rounded-md shadow-sm">
                        <div className="grid grid-cols-1 gap-3">
                            {days.map((day) => {
                                const { open, close } = selectedClinic.schedule[day];

                                return (
                                    <div
                                        key={day}
                                        className="grid grid-cols-12 gap-4 items-center bg-white p-3 rounded-md border border-gray-200"
                                    >
                                        <div className="col-span-2 font-medium text-gray-700">{day}</div>

                                        <div className="col-span-4">
                                            <input
                                                type="time"
                                                value={open}
                                                onChange={(e) => handleOpenChange(day, e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>

                                        <div className="col-span-1 text-center text-sm text-gray-500">to</div>

                                        <div className="col-span-4">
                                            <input
                                                type="time"
                                                value={close}
                                                onChange={(e) => handleCloseChange(day, e.target.value)}
                                                disabled={!open}
                                                min={open}
                                                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                                    errors[day]
                                                        ? "border-red-500"
                                                        : "border-gray-300"
                                                }`}
                                            />
                                            {errors[day] && (
                                                <p className="text-sm text-red-500 mt-1">{errors[day]}</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 button rounded-md"
                        onClick={handleSubmitForm}
                    >
                        {formMode === 'add' ? 'Create Clinic' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RenderClinicForm