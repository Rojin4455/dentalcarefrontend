import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
} from 'lucide-react';
import EmergencyQuestion from './questions/EmergencyQuestion';
import FactorsQuestion from './questions/FactorsQuestion';
import LastVisitQuestion from './questions/LastVisitQuestion';
import TimePreferenceQuestion from './questions/TimePreferenceQuestion';
import InsuranceQuestion from './questions/InsuranceQuestion';
import InsuranceProviderQuestion from './questions/InsuranceProviderQuestion';
import PaymentOptionQuestion from './questions/PaymentOptionQuestion';
import ContactInfoQuestion from './questions/ContactInfoQuestion';
import ResultsPage from './ResultsPage';
import AnxietyQuestion from './questions/AnxietyQuestion';
import HomePage from '../../pages/user/HomePage';
import { setLocation } from '../../slices/locationSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

// Main App Component
export default function ClinicPortal() {

    console.log("herererere: ",)
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [progress, setProgress] = useState(0);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [answers, setAnswers] = useState({
    emergency: '',
    factors: [],
    lastVisit: '',
    anxiety: '',
    timePreference: [],
    hasInsurance: '',
    insuranceProvider: '',
    paymentOption: '',
    email: ''
  });

  // Total number of questions (dynamically calculated based on insurance answer)
  const totalQuestions = answers.hasInsurance === 'Yes' || answers.hasInsurance === 'No' ? 8 : 7;

  // Update progress whenever the current step changes
  React.useEffect(() => {
    setProgress((currentStep / totalQuestions) * 100);
  }, [currentStep, totalQuestions]);

  // Handle location selection
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    
    setCurrentStep(1); // Move to questionnaire
  };

  console.log("selected LocationL ", selectedLocation)

  // Handle form submissions
  const handleNext = () => {
    if (currentStep <=totalQuestions) {

      if (answers.email){
        try{
          const response = axiosInstance.post("api/admin/add-email/",{
            answers:answers
          })
          if (response.status === 200){
            console.log("success response")
          }else{
            console.error("error response: ", response)
          }

        }catch(error){
          console.error("error response: ", error)
        }
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle answer selection
  const handleAnswer = (question, answer) => {
    setAnswers({
      ...answers,
      [question]: answer
    });
  };

  const handleMultiAnswer = (question, answer) => {
    const currentAnswers = answers[question] || [];
    
    if (currentAnswers.includes(answer)) {
      // Remove if already selected
      setAnswers({
        ...answers,
        [question]: currentAnswers.filter(item => item !== answer)
      });
    } else {
      // Add if not selected
      setAnswers({
        ...answers,
        [question]: [...currentAnswers, answer]
      });
    }
  };

  // Check if we can proceed to the next question
  const canProceed = () => {
    switch(currentStep) {
      case 1: // Emergency question
        return answers.emergency !== '';
      case 2: // Important factors
        return answers.factors.length > 0;
      case 3: // Last visit
        return answers.lastVisit !== '';
      case 4: // Anxiety level
        return answers.anxiety !== '';
      case 5: // Time preference
        return answers.timePreference.length > 0;
      case 6: // Insurance question
        return answers.hasInsurance !== '';
      case 7: // Insurance provider or payment option
        if (answers.hasInsurance === 'Yes') {
          return answers.insuranceProvider !== '';
        } else {
          return answers.paymentOption !== '';
        }
      case 8: // Email
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.email);
      default:
        return true;
    }
  };

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <HomePage onLocationSelect={handleLocationSelect} />;
      case 1:
        return <EmergencyQuestion answer={answers.emergency} onSelect={(answer) => handleAnswer('emergency', answer)} />;
      case 2:
        return <FactorsQuestion selected={answers.factors} onSelect={(answer) => handleMultiAnswer('factors', answer)} />;
      case 3:
        return <LastVisitQuestion answer={answers.lastVisit} onSelect={(answer) => handleAnswer('lastVisit', answer)} />;
      case 4:
        return <AnxietyQuestion answer={answers.anxiety} onSelect={(answer) => handleAnswer('anxiety', answer)} />;
      case 5:
        return <TimePreferenceQuestion selected={answers.timePreference} onSelect={(answer) => handleMultiAnswer('timePreference', answer)} />;
      case 6:
        return <InsuranceQuestion answer={answers.hasInsurance} onSelect={(answer) => handleAnswer('hasInsurance', answer)} />;
      case 7:
        if (answers.hasInsurance === 'Yes') {
          return <InsuranceProviderQuestion answer={answers.insuranceProvider} onSelect={(answer) => handleAnswer('insuranceProvider', answer)} />;
        } else {
          return <PaymentOptionQuestion answer={answers.paymentOption} onSelect={(answer) => handleAnswer('paymentOption', answer)} />;
        }
      case 8:
        return <ContactInfoQuestion email={answers.email} onEmailChange={(email) => handleAnswer('email', email)} />;
      case 9:
        dispatch(setLocation({location:selectedLocation, answers:answers}))
        navigate('/clinic-results')
        // return <ResultsPage location={selectedLocation} answers={answers} />;
      default:
        return <HomePage onLocationSelect={handleLocationSelect} />;
    }
  };

  const renderProgressAndButtons = () => {
    if (currentStep > 0 && currentStep < 9) {
      return (
        <div className="w-full max-w-4xl mx-auto">
          {/* Material Design progress bar - taller and more defined */}
          <div className="w-full bg-gray-200 h-3 rounded-full mb-10">
            <div 
              className="bg-[#7eb0ed] h-3 rounded-full transition-all duration-300 shadow-sm"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
  
          {/* Material Design buttons with elevation */}
          <div className="flex justify-between mt-10 mb-6">
            {/* Back button with Material Design styling */}
            <button 
              onClick={handleBack}
              className="px-8 py-3 flex items-center justify-center text-gray-700 hover:bg-gray-100 
                      transition-all duration-200 rounded-full border border-gray-300"
            >
              <ChevronLeft size={22} className="mr-2" /> Back
            </button>
  
            {/* Primary action button with Material Design elevation */}
            <button 
              onClick={handleNext}
              disabled={!canProceed()}
              className={`
                px-10 py-3 rounded-full flex items-center justify-center shadow-md hover:shadow-lg
                transition-all duration-200 font-medium text-base
                ${canProceed() 
                  ? 'bg-[#7eb0ed] text-white hover:bg-[#9fdef5] active:bg-[#6eccf5] active:shadow-inner' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
              `}
            >
              {currentStep === 8 ? 'Find Dentists' : 'Next'} <ChevronRight size={22} className="ml-2" />
            </button>
          </div>
        </div>
      );
    }
    return null;
  };
  

  return (
    <div className="min-h-screen bg-gray-50">
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Paper-like container with elevation */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8 lg:p-12">
        {renderProgressAndButtons()}
        {renderStep()}
      </div>
    </div>
  </div>
  
  );
}

// Homepage Component



