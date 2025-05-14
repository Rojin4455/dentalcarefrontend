import { useEffect, useState } from 'react';
import { Building, Calendar, ClipboardList, Clock, Menu, Settings, Users, X } from 'lucide-react';
import RenderClinicsList from './RenderClinicList';
import RenderClinicForm from './RenderClinicForm';
import axiosInstance from '../../api/axiosInstance';
import {useSelector} from 'react-redux'
import SettingsPage from './SettingsPage';

export default function ClinicAdminPortal() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('clinics');
  const BASE_API_URL = import.meta.env.VITE_BASE_API_URL
  const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY


  const [clinics, setClinics] = useState([]);

  const [selectedClinic, setSelectedClinic] = useState(null);
  const [formMode, setFormMode] = useState('view');
  const user = useSelector((state) => state.user)
  console.log("user", user)

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const navigationItems = [
    { id: 'clinics', label: 'Clinics', icon: <Building size={20} /> },
    // { id: 'doctors', label: 'Doctors', icon: <Users size={20} /> },
    // { id: 'appointments', label: 'Appointments', icon: <Calendar size={20} /> },
    // { id: 'schedule', label: 'Schedule', icon: <Clock size={20} /> },
    // { id: 'reports', label: 'Reports', icon: <ClipboardList size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const handleEditClinic = (clinic) => {
    setSelectedClinic(clinic);
    setFormMode('edit');
  };

  const handleAddNewClinic = () => {
    setSelectedClinic({
      name: "",
      location: "",
      images: [],
      description: "",
      schedule: {
        Monday: { open: "", close: "" },
        Tuesday: { open: "", close: "" },
        Wednesday: { open: "", close: "" },
        Thursday: { open: "", close: "" },
        Friday: { open: "", close: "" },
        Saturday: { open: "", close: "" },
        Sunday: { open: "", close: "" },
      }
    });
    setFormMode('add');
  };

  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];
  
  const normalizeClinicSchedules = (clinics) => {
    return clinics.map(clinic => {
      const normalizedSchedule = {};
  
      daysOfWeek.forEach(day => {
        if (clinic.schedule && clinic.schedule[day]) {
          normalizedSchedule[day] = clinic.schedule[day];
        } else {
          normalizedSchedule[day] = { open: "", close: "" };
        }
      });
  
      return {
        ...clinic,
        schedule: normalizedSchedule
      };
    });
  };


  useEffect(() => {
      const fetchClinics = async () => {
        try{
        const response = await axiosInstance.get(`${BASE_API_URL}api/admin/clinics/`)
        if(response.status === 200){
            console.log("success response : ", response)
            const normalizedData = normalizeClinicSchedules(response.data);
        setClinics(normalizedData);
        }else{
            console.error("error response; ", response)
        }
    }catch(error){
        console.error("Something went wrong in fetch clinic")
    }
    }
    fetchClinics()
  },[])

  const handleCancelEdit = () => {
    setSelectedClinic(null);
    setFormMode('view');
  };


  

  

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white h-full shadow-md transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          {sidebarOpen && <h1 className="text-xl font-bold text-muted">Dental Care Portal</h1>}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-md hover:bg-gray-100 ${!sidebarOpen && 'mx-auto'}`}
          >
            <Menu size={20} />
          </button>
        </div>
        
        <nav className="flex-1 pt-4">
          {navigationItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center p-4 hover:bg-gray-50 transition-colors ${
                activeTab === item.id ? 'text-text-muted blue-600 border-r-4 border-text-muted text-accent' : 'text-gray-600'
              }`}
            >
              <div className={`${!sidebarOpen && 'mx-auto'}`}>
                {item.icon}
              </div>
              {sidebarOpen && <span className="ml-3 font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-100">
          {sidebarOpen ? (
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                A
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">Admin User</p>
                <p className="text-xs text-gray-500">{user.user.email}</p>
              </div>
            </div>
          ) : (
            <div className="mx-auto w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              A
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{
            navigationItems.find(item => item.id === activeTab)?.label || 'Dashboard'
          }</h1>
          <p className="text-gray-500">
            {activeTab === 'clinics' && formMode === 'view' && 'Manage your medical clinics and their details'}
            {activeTab === 'clinics' && formMode === 'edit' && 'Edit clinic information and schedule'}
            {activeTab === 'clinics' && formMode === 'add' && 'Add a new clinic to your network'}
          </p>
        </div>
        
        {activeTab === 'clinics' && (
          <>
            {formMode === 'view' ? <RenderClinicsList handleAddNewClinic={handleAddNewClinic} clinics={clinics} handleEditClinic={handleEditClinic} GOOGLE_API_KEY={GOOGLE_API_KEY} /> : <RenderClinicForm setSelectedClinic={setSelectedClinic} selectedClinic={selectedClinic} handleCancelEdit={handleCancelEdit} days={days} formMode={formMode} />}
          </>
        )}

        {activeTab === 'settings' && (
            <SettingsPage user={user}/>
        )}
        
        {activeTab !== 'clinics' && activeTab !== 'settings' &&(
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-64">
            <p className="text-gray-500">This section is under development</p>
          </div>
        )}
      </div>
    </div>
  );
}