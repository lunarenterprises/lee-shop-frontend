// import React, { useState } from "react";
// import { ChevronRight, ChevronDown } from "lucide-react";

// const BusinessInfoForm = ({
//   onNext = () => {},
//   onBack = () => {},
//   onSkip = () => {},
//   defaultData = {},
//   showSkip = true,
//   showBack = true,
//   customImage = null,
//   customQuote = null,
//   customTitle = null,
//   customCategories = null,
//   requiredFields = [
//     "shopName",
//     "ownerName",
//     "businessCategory",
//     "shopAddress",
//     "state",
//     "city",
//   ],
// }) => {
//   const [formData, setFormData] = useState({
//     shopName: defaultData.shopName || "",
//     ownerName: defaultData.ownerName || "",
//     businessCategory: defaultData.businessCategory || "",
//     shopAddress: defaultData.shopAddress || "",
//     state: defaultData.state || "",
//     city: defaultData.city || "",
//     ...defaultData,
//   });

//   const [showMoreCategories, setShowMoreCategories] = useState(false);

//   const defaultQuoteText =
//     "Strengthen local commerce by connecting nearby sellers, services, and customers to promote sustainability.";

//   const defaultCategoriesData = [
//     { id: "grocery", label: "Grocery", value: "grocery" },
//     { id: "bakery", label: "Bakery", value: "bakery" },
//     {
//       id: "gifts-custom",
//       label: "Gifts & Custom Products",
//       value: "gifts-custom",
//     },
//     { id: "pet-care", label: "Pet Care", value: "pet-care" },
//     {
//       id: "hardware-utilities",
//       label: "Hardware & Utilities",
//       value: "hardware-utilities",
//     },
//     {
//       id: "fashion-accessories",
//       label: "Fashion Accessories",
//       value: "fashion-accessories",
//     },
//     {
//       id: "stationery-printing",
//       label: "Stationery & Printing",
//       value: "stationery-printing",
//     },
//     { id: "beauty", label: "Beauty", value: "beauty" },
//     {
//       id: "furniture-decor",
//       label: "Furniture & Decor",
//       value: "furniture-decor",
//     },
//     { id: "kitchen", label: "Kitchen", value: "kitchen" },
//   ];

//   const categories = customCategories || defaultCategoriesData;
//   const visibleCategories = showMoreCategories
//     ? categories
//     : categories.slice(0, 6);
//   const title = customTitle || "Basic Business & Shop Location Info";
//   const quote = customQuote || defaultQuoteText;

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleCategorySelect = (categoryValue) => {
//     setFormData((prev) => ({
//       ...prev,
//       businessCategory: categoryValue,
//     }));
//   };

//   const validateForm = () => {
//     return requiredFields.every((field) => {
//       const value = formData[field];
//       return value && value.toString().trim() !== "";
//     });
//   };

//   const handleNext = () => {
//     if (validateForm()) {
//       onNext(formData);
//     }
//   };

//   const progressSteps = [
//     { id: 1, completed: true, active: false },
//     { id: 2, completed: true, active: false },
//     { id: 3, completed: false, active: true },
//     { id: 4, completed: false, active: false },
//     { id: 5, completed: false, active: false },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       {/* Left Side - Image and Quote */}
//       <div className="w-1/2 relative">
//         <div className="absolute top-6 left-6 z-10">
//           <div className="flex items-center space-x-2">
//             <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
//               <span className="text-white font-bold text-lg">$</span>
//             </div>
//             <span className="text-green-600 font-semibold text-xl">
//               LeeShop
//             </span>
//           </div>
//         </div>

//         {customImage ? (
//           <img
//             src={customImage}
//             alt="Business owner"
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <div className="w-full h-full bg-gradient-to-br from-green-400 via-green-300 to-yellow-200 flex items-end justify-center relative overflow-hidden">
//             <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
//             <div className="relative z-10 p-8 max-w-md mb-8">
//               <div className="text-white text-lg font-medium leading-relaxed mb-4">
//                 "{quote}"
//               </div>
//               <div className="w-12 h-1 bg-white"></div>
//             </div>
//             {/* Decorative flower elements */}
//             <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
//             <div className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-yellow-300/30 rounded-full blur-lg"></div>
//           </div>
//         )}
//       </div>

//       {/* Right Side - Form */}
//       <div className="w-1/2 bg-white flex flex-col">
//         {/* Progress Bar */}
//         <div className="p-8 pb-4">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-sm text-gray-600">
//               Business Registration.
//             </span>
//           </div>
//           <div className="flex items-center space-x-3">
//             {progressSteps.map((step, index) => (
//               <React.Fragment key={step.id}>
//                 <div
//                   className={`w-4 h-4 rounded-full flex items-center justify-center ${
//                     step.completed
//                       ? "bg-green-500"
//                       : step.active
//                       ? "bg-green-500"
//                       : "bg-green-200"
//                   }`}
//                 >
//                   {step.completed && (
//                     <div className="w-2 h-2 bg-white rounded-full"></div>
//                   )}
//                   {step.active && (
//                     <div className="w-2 h-2 bg-white rounded-full"></div>
//                   )}
//                 </div>
//                 {index < progressSteps.length - 1 && (
//                   <div
//                     className={`h-1 w-16 ${
//                       step.completed ? "bg-green-500" : "bg-green-200"
//                     }`}
//                   ></div>
//                 )}
//               </React.Fragment>
//             ))}
//           </div>
//         </div>

//         {/* Form Content */}
//         <div className="flex-1 overflow-y-auto px-8">
//           <div className="max-w-2xl">
//             <div className="flex items-center mb-8">
//               <div
//                 className="w-4 h-4 bg-green-500 mr-3"
//                 style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }}
//               ></div>
//               <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
//             </div>

//             {/* Shop Name and Owner Name */}
//             <div className="grid grid-cols-2 gap-6 mb-8">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-3">
//                   Shop Name
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.shopName}
//                   onChange={(e) =>
//                     handleInputChange("shopName", e.target.value)
//                   }
//                   placeholder="Enter your Shop Name."
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-3">
//                   Owner Name
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.ownerName}
//                   onChange={(e) =>
//                     handleInputChange("ownerName", e.target.value)
//                   }
//                   placeholder="Enter Owner Name."
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
//                 />
//               </div>
//             </div>

//             {/* Business Category */}
//             <div className="mb-8">
//               <label className="block text-sm font-semibold text-gray-700 mb-4">
//                 Business Category
//               </label>
//               <div className="flex flex-wrap gap-3">
//                 {visibleCategories.map((category) => (
//                   <button
//                     key={category.id}
//                     onClick={() => handleCategorySelect(category.value)}
//                     className={`px-6 py-3 rounded-full border transition-all duration-200 ${
//                       formData.businessCategory === category.value
//                         ? "bg-green-100 border-green-500 text-green-700"
//                         : "bg-white border-gray-300 text-gray-700 hover:border-green-300 hover:bg-green-50"
//                     }`}
//                   >
//                     {category.label}
//                   </button>
//                 ))}
//                 {categories.length > 6 && (
//                   <button
//                     onClick={() => setShowMoreCategories(!showMoreCategories)}
//                     className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 hover:border-green-300 hover:bg-green-50 transition-all duration-200 flex items-center space-x-2"
//                   >
//                     <span>
//                       {showMoreCategories ? "View less" : "View more"}
//                     </span>
//                     <ChevronDown
//                       className={`w-4 h-4 transition-transform duration-200 ${
//                         showMoreCategories ? "rotate-180" : ""
//                       }`}
//                     />
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Shop Address */}
//             <div className="mb-8">
//               <label className="block text-sm font-semibold text-gray-700 mb-3">
//                 Shop Address
//               </label>
//               <textarea
//                 value={formData.shopAddress}
//                 onChange={(e) =>
//                   handleInputChange("shopAddress", e.target.value)
//                 }
//                 placeholder="Enter your Shop Address."
//                 rows="3"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
//               />
//             </div>

//             {/* State and City */}
//             <div className="grid grid-cols-2 gap-6 mb-8">
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-3">
//                   State
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.state}
//                   onChange={(e) => handleInputChange("state", e.target.value)}
//                   placeholder="Enter your State your shop in."
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-3">
//                   City
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.city}
//                   onChange={(e) => handleInputChange("city", e.target.value)}
//                   placeholder="Enter your State your shop in."
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Bottom Navigation */}
//         <div className="p-8 pt-4 border-t border-gray-100">
//           <div className="flex items-center justify-between">
//             {showBack ? (
//               <button
//                 onClick={onBack}
//                 className="px-8 py-3 text-gray-600 border border-gray-300 rounded-lg hover:text-gray-800 hover:border-gray-400 transition-all duration-200"
//               >
//                 Back
//               </button>
//             ) : (
//               <div></div>
//             )}

//             <div className="flex items-center space-x-4">
//               {showSkip && (
//                 <button
//                   onClick={onSkip}
//                   className="px-8 py-3 text-gray-600 border border-gray-300 rounded-lg hover:text-gray-800 hover:border-gray-400 transition-all duration-200"
//                 >
//                   Skip
//                 </button>
//               )}

//               <button
//                 onClick={handleNext}
//                 disabled={!validateForm()}
//                 className={`flex items-center px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
//                   validateForm()
//                     ? "bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl"
//                     : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                 }`}
//               >
//                 Next
//                 <ChevronRight className="w-4 h-4 ml-2" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Example usage component
// const RegProductseller = () => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [allFormData, setAllFormData] = useState({});

//   const handleNext = (formData) => {
//     console.log("Business Info:", formData);
//     setAllFormData((prev) => ({ ...prev, businessInfo: formData }));
//     setCurrentStep((prev) => prev + 1);
//   };

//   const handleBack = () => {
//     setCurrentStep((prev) => prev - 1);
//   };

//   const handleSkip = () => {
//     console.log("Skipped business info step");
//     setCurrentStep((prev) => prev + 1);
//   };

//   if (currentStep > 1) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">Next Step</h2>
//           <p className="text-gray-600 mb-4">
//             Business information collected successfully!
//           </p>
//           {allFormData.businessInfo && (
//             <div className="bg-gray-50 p-4 rounded-lg mb-4">
//               <p>
//                 <strong>Shop:</strong> {allFormData.businessInfo.shopName}
//               </p>
//               <p>
//                 <strong>Owner:</strong> {allFormData.businessInfo.ownerName}
//               </p>
//               <p>
//                 <strong>Category:</strong>{" "}
//                 {allFormData.businessInfo.businessCategory}
//               </p>
//               <p>
//                 <strong>Location:</strong> {allFormData.businessInfo.city},{" "}
//                 {allFormData.businessInfo.state}
//               </p>
//             </div>
//           )}
//           <button
//             onClick={() => setCurrentStep(1)}
//             className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 w-full"
//           >
//             Go Back to Form
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <BusinessInfoForm
//       onNext={handleNext}
//       onBack={handleBack}
//       onSkip={handleSkip}
//       defaultData={{
//         shopName: "",
//         ownerName: "",
//         businessCategory: "",
//         shopAddress: "",
//         state: "",
//         city: "",
//       }}
//     />
//   );
// };

// export default RegProductseller;
