import React, { useState } from "react";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { useNavigate, useNavigation } from "react-router-dom";

const BusinessRegistrationForm = ({
  onNext = () => {},
  onBack = () => {},
  onSkip = () => {},
  defaultSelection = null,
  showSkip = true,
  showBack = true,
  customImage = "../../reg_1.png",
  customQuote = null,
  customTitle = null,
  customOptions = null,
}) => {
  const [selectedOption, setSelectedOption] = useState(defaultSelection);

  const defaultQuoteText =
    "Help small businesses and professionals grow by giving them an easy, affordable way to sell online and reach local customers.";

  const defaultOptionsData = [
    { id: "product-seller", label: "Product Seller", value: "product-seller" },
    {
      id: "service-provider",
      label: "Service Provider",
      value: "service-provider",
    },
    { id: "both", label: "Both", value: "both" },
  ];

  const options = customOptions || defaultOptionsData;
  const title = customTitle || "Who Are You Joining As?";
  const quote = customQuote || defaultQuoteText;

  const handleOptionSelect = (optionValue) => {
    setSelectedOption(optionValue);
  };

  const handleNext = () => {
    if (selectedOption) {
      onNext(selectedOption);
    }
  };

  const progressSteps = [
    { id: 1, completed: true, active: false },
    { id: 2, completed: false, active: true },
    { id: 3, completed: false, active: false },
    { id: 4, completed: false, active: false },
    { id: 5, completed: false, active: false },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      <div className="w-full md:w-1/2 relative">
        {customImage ? (
          <div className="hidden md:block w-full h-full relative">
            <div
              className="relative w-full h-[250px] sm:h-[350px] md:h-[550px] md:w-[350px] lg:w-[490px] lg:h-[800px] xl:w-[609px] xl:h-[690px] bg-cover bg-no-repeat bg-center lg:bg-contain md:bg-contain rounded-4xl mx-auto mt-6 md:ml-10 md:mt-10 md:mb-10"
              style={{ backgroundImage: `url('${customImage}')` }}
            >
              <div className="absolute top-5 left-10 z-10">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-[117px] h-[54px]"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-[300px] sm:h-[400px] flex items-center justify-center bg-gradient-to-br from-green-400 to-green-600">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 max-w-md mx-4 text-center">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-orange-400 rounded-full"></div>
                </div>
                <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
                </div>
              </div>
              <div className="text-white text-lg font-medium leading-relaxed">
                "{quote}"
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Side - Form */}
      <div className="w-full  md:w-1/2 flex flex-col ">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="flex items-end justify-end mb-2">
            <p className="text-[16px] text-[#0A5C15] font-semibold">
              Business Registration.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {progressSteps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    step.completed
                      ? "bg-green-500"
                      : step.active
                      ? "bg-green-500"
                      : "bg-green-200"
                  }`}
                >
                  {(step.completed || step.active) && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                {index < progressSteps.length - 1 && (
                  <div
                    className={`h-1 w-50 ${
                      step.completed ? "bg-green-500" : "bg-green-200"
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex-1 align-middle  justify-center px-4 sm:px-6 md:px-8 py-8 md:py-12 ">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#0A5C15] mb-8 sm:mb-12 text-center">
              {title}
            </h2>

            <div className="space-y-4">
              {options.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-center p-4 sm:p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    selectedOption === option.value
                      ? "border-green-500 bg-[#D4F49C]"
                      : "border-gray-200 bg-[#D4F49C] hover:border-green-300 hover:bg-green-25"
                  }`}
                  onClick={() => handleOptionSelect(option.value)}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                      selectedOption === option.value
                        ? "border-green-500 bg-green-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedOption === option.value && (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-lg font-medium text-[#0A5C15]">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 md:px-4 pb-8 ">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {showBack ? (
              <button
                onClick={onBack}
                className="flex items-center justify-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200 w-full sm:w-auto"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
            ) : (
              <div></div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full sm:w-auto gap-4">
              {showSkip && (
                <button
                  onClick={onSkip}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200 w-full sm:w-auto"
                >
                  Skip
                </button>
              )}

              <button
                onClick={handleNext}
                disabled={!selectedOption}
                className={`flex items-center justify-center px-8 py-3 rounded-lg font-medium transition-all duration-200 w-full sm:w-auto ${
                  selectedOption
                    ? "bg-[#0A5C15] text-white hover:bg-green-700 shadow-lg hover:shadow-xl"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Example usage component
const RegistrationJoin = () => {
  const pathMap = {
    "product-seller": "/BusinessRegistrationForm ",
    "service-provider": "/ServiceRegistration",
    both: "/BothRegistrationForm",
  };

  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});

  const handleNext = (selectedValue) => {
    setFormData((prev) => ({ ...prev, businessType: selectedValue }));
    navigate(pathMap[selectedValue], {
      state: { businessType: selectedValue },
    });
  };

  const handleBack = () => navigate(-1);
  const handleSkip = () => navigate("/");

  if (currentStep > 1) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Next Step</h2>
          <p className="text-gray-600 mb-4">
            Business Type Selected: {formData.businessType}
          </p>
          <button
            onClick={() => setCurrentStep(1)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 w-full"
          >
            Go Back to Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <BusinessRegistrationForm
      onNext={handleNext}
      onBack={handleBack}
      onSkip={handleSkip}
      defaultSelection={null}
      showSkip={true}
      showBack={true}
    />
  );
};

export default RegistrationJoin;
