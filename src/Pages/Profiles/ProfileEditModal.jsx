import React, { useState } from 'react'

const businessCategories = [
    "Grocery", "Bakery", "Gifts & Custom Products", "Pet Care",
    "Hardware & Utilities", "Fashion Accessories", "Stationery & Printing",
    "Beauty", "Furniture & Decor", "Kitchen"
];

const ProfileEditModal = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState("Basic Info");
    const [selectedDays, setSelectedDays] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([])
    const [deliveryType, setDeliveryType] = useState("own-staff");
    const [businessType, setBusinessType] = useState("")
    const [shopName, setShopName] = useState("")
    const [ownerName, setOwnerName] = useState("")
    const [shopAddress, setShopAddress] = useState("")
    const [state, setState] = useState("")
    const [city, setCity] = useState("")
    const [file, setFile] = useState(null)
    const [workingHours, setWorkingHours] = useState({
        openingHour: "01:00",
        openingPeriod: "AM",
        closingHour: "01:00",
        closingPeriod: "PM",
    });
    const [phoneNumbers, setPhoneNumbers] = useState(["", "", "", ""]);

    const toggleDay = (day) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    const toggleCategory = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter(cat => cat !== category) : [...prev, category]
        );
    };

    const handleHourChange = (type, value) => {
        setWorkingHours((prev) => ({ ...prev, [type]: value }));
    };

    const handlePhoneChange = (index, value) => {
        const updated = [...phoneNumbers];
        updated[index] = value;
        setPhoneNumbers(updated);
    };

    const handleDeliveryType = (type) => setDeliveryType(type);

    const handleProfileSave = () => {
        console.log("selectedDays : ",selectedDays)
        console.log("selectedCategories : ",selectedCategories)
        console.log("deliveryType : ",deliveryType)
        console.log("businessType : ",businessType)
        console.log("shopName : ",shopName)
        console.log("ownerName : ",ownerName)
        console.log("shopAddress : ",shopAddress)
        console.log("state : ",state)
        console.log("city : ",city)
        console.log("file : ",file)
        console.log("workingHours : ",workingHours)
        console.log("phoneNumbers : ",phoneNumbers)
    }

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 ">
            <div className="bg-white rounded-2xl w-full max-w-3xl h-[570px] p-6 md:p-10 shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full border border-green-700 text-green-700 hover:bg-green-100"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <h3 className="text-xl font-semibold text-green-800">Profile Edit</h3>
                    </div>
                    <div className="flex gap-2">
                        <button className="border border-green-700 text-green-700 px-4 py-1 rounded-md hover:bg-green-100" onClick={() => onClose(false)}>Cancel</button>
                        <button className="bg-green-800 text-white px-5 py-1 rounded-md hover:bg-green-900" onClick={() => handleProfileSave()}>Save</button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 border-b border-gray-300 mb-6">
                    {["Basic Info", "Location & Working Hours", "Gallery", "Delivery & Contact Info"].map((tab, index) => (
                        <button
                            key={index}
                            className={`pb-2 text-green-800 border-b-2 transition-all duration-200 ${activeTab === tab ? "border-green-800 font-semibold " : "border-transparent hover:text-green-600 hover:border-green-600"}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Conditionally Render Form Sections */}

                {/* Active Basic Info */}
                {activeTab === "Basic Info" && (
                    <div className="mb-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Business Type</label>
                            <select className="w-1/2 border border-green-700 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500" onChange={(e) => setBusinessType(e.target.value)}>
                                <option>Product Seller</option>
                                <option>Service Provider</option>
                            </select>
                        </div>
                        <div className='flex w-full gap-3'>
                            <div className='w-1/2'>
                                <label className="block text-sm font-medium mb-1">Shop Name</label>
                                <input
                                    type="text"
                                    defaultValue="CakeZone"
                                    onChange={(e) => setShopName(e.target.value)}
                                    className="w-full border border-green-700 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                />
                            </div>
                            <div className='w-1/2'>
                                <label className="block text-sm font-medium mb-1">Owner Name</label>
                                <input
                                    type="text"
                                    defaultValue="Aurobindo"
                                    onChange={(e) => setOwnerName(e.target.value)}
                                    className="w-full border border-green-700 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">Business Category</label>
                            <div className="flex flex-wrap gap-4">
                                {businessCategories.map((cat, index) => (
                                    <span key={index} className={`border px-4 py-2 hover:cursor-pointer  rounded-full text-base ${selectedCategories.includes(cat) ? 'bg-green-800 text-white hover:bg-green-700' : 'border-green-700 text-green-800 hover:bg-green-100'}`} onClick={() => toggleCategory(cat)}>
                                        {cat}
                                    </span>
                                ))}
                                <button className="border border-green-700 px-4 py-2 rounded-full text-base hover:bg-green-100 text-green-800">View more</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Active Location & Working Hours */}

                {activeTab === "Location & Working Hours" && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Shop Address</label>
                                <textarea
                                    placeholder="Enter your Shop Address."
                                    onChange={(e) => setShopAddress(e.target.value)}
                                    className="w-full border border-green-700 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                    rows={5}
                                />
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">State</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your State your shop in."
                                        onChange={(e) => setState(e.target.value)}
                                        className="w-full border border-green-700 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">City</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your City your shop in."
                                        onChange={(e) => setCity(e.target.value)}
                                        className="w-full border border-green-700 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Working Days */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Working Days</label>
                            <div className="grid grid-cols-7 gap-2">
                                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                                    <button key={i} className={`border px-3 py-1 hover:bg-green-100 hover:cursor-pointer rounded-md text-sm ${selectedDays.includes(day) ? 'bg-green-800 text-white' : 'border-green-700 text-green-800'}`} onClick={() => toggleDay(day)}>
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Opening & Closing Hours */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Opening & Closing Hours</label>
                            <div className="bg-green-800 text-white rounded-md text-center mb-3 py-1">
                                Opening <span className="mx-4">-</span> Closing
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {/* Opening */}
                                <div className="flex gap-2">
                                    <select
                                        className="border border-green-700 rounded-md px-2 py-1 w-1/2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                        value={workingHours.openingHour}
                                        onChange={(e) => handleHourChange("openingHour", e.target.value)}
                                    >
                                        {Array.from({ length: 12 }, (_, h) => {
                                            const hour = h + 1;
                                            const formatted = hour < 10 ? `0${hour}` : hour;
                                            return <option key={hour}>{formatted}:00</option>;
                                        })}
                                    </select>
                                    <select
                                        className="border border-green-700 rounded-md px-2 py-1 w-1/2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                        value={workingHours.openingPeriod}
                                        onChange={(e) => handleHourChange("openingPeriod", e.target.value)}
                                    >
                                        <option>AM</option>
                                        <option>PM</option>
                                    </select>
                                </div>

                                {/* Closing */}
                                <div className="flex gap-2">
                                    <select
                                        className="border border-green-700 rounded-md px-2 py-1 w-1/2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                        value={workingHours.closingHour}
                                        onChange={(e) => handleHourChange("closingHour", e.target.value)}
                                    >
                                        {Array.from({ length: 12 }, (_, h) => {
                                            const hour = h + 1;
                                            const formatted = hour < 10 ? `0${hour}` : hour;
                                            return <option key={hour}>{formatted}:00</option>;
                                        })}
                                    </select>
                                    <select
                                        className="border border-green-700 rounded-md px-2 py-1 w-1/2 focus:outline-none focus:ring-1 focus:ring-green-500"
                                        value={workingHours.closingPeriod}
                                        onChange={(e) => handleHourChange("closingPeriod", e.target.value)}
                                    >
                                        <option>AM</option>
                                        <option>PM</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {activeTab === "Gallery" && (
                    <div className="mt-6">
                        <div className="border border-green-700 rounded-lg p-4 bg-white flex gap-3">
                            {/* Upload Box */}
                            <label
                                htmlFor="gallery-upload"
                                className="flex flex-col items-center space-y-2 justify-center border-2 border-dashed border-green-700 rounded-lg p-6 cursor-pointer text-center hover:bg-green-100 transition-all duration-200"
                            >
                                <img src="/upload.png" alt="upload image" className="h-7" />
                                <p className="text-sm text-green-700 mb-1">
                                    Drag and drop your images<br />anywhere or
                                </p>
                                <button
                                    type="button"
                                    className="bg-green-700 text-white px-4 py-1 rounded text-sm mt-2 hover:cursor-pointer"
                                    onClick={() => document.getElementById("gallery-upload").click()}
                                >
                                    Upload an Image
                                </button>
                            </label>

                            <input
                                id="gallery-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setFile(file)
                                        // Optional: upload or preview
                                    }
                                }}
                            />


                            <div className="w-full grid sm:grid-cols-3 md:grid-cols-3 gap-4">

                                {/* Sample Gallery Images */}
                                {[
                                    "https://i.pravatar.cc/300",
                                    "https://i.pravatar.cc/600",
                                    "https://i.pravatar.cc/700",
                                    "https://i.pravatar.cc/800",
                                    "https://i.pravatar.cc/400",
                                    "https://i.pravatar.cc/500"
                                ].map((img, index) => (
                                    <div key={index} className="rounded-lg overflow-hidden">
                                        <img
                                            src={img}
                                            alt={`Gallery ${index}`}
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "Delivery & Contact Info" && (
                    <div className=" rounded-lg ">
                        <h2 className="text-lg font-semibold text-green-700 mb-4">Delivery Type</h2>

                        <div className="flex flex-wrap gap-4 mb-6">
                            <button
                                className={`flex items-center px-4 py-2 rounded-full border text-sm ${deliveryType === "own-staff"
                                    ? "bg-green-100 border-green-700 text-green-700"
                                    : "border-gray-300 text-gray-600"
                                    }`}
                                onClick={() => handleDeliveryType("own-staff")}
                            >
                                {deliveryType === "own-staff" ? "✅" : "🟢"} I have my own delivery staff
                            </button>

                            <button
                                className={`flex items-center px-4 py-2 rounded-full border text-sm ${deliveryType === "freelance"
                                    ? "bg-green-100 border-green-700 text-green-700"
                                    : "border-gray-300 text-gray-600"
                                    }`}
                                onClick={() => handleDeliveryType("freelance")}
                            >
                                {deliveryType === "freelance" ? "✅" : "🟢"} I need freelance delivery support
                            </button>

                            <button
                                className={`flex items-center px-4 py-2 rounded-full border text-sm ${deliveryType === "in-store"
                                    ? "bg-green-100 border-green-700 text-green-700"
                                    : "border-gray-300 text-gray-600"
                                    }`}
                                onClick={() => handleDeliveryType("in-store")}
                            >
                                {deliveryType === "in-store" ? "✅" : "🟢"} Only in-store service
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {phoneNumbers.map((phone, index) => (
                                <div key={index}>
                                    <label className="block text-sm font-semibold mb-1 text-green-700">
                                        Primary Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="+91 89348134581"
                                        value={phone}
                                        onChange={(e) => handlePhoneChange(index, e.target.value)}
                                        className="w-full px-4 py-2 border border-green-700 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProfileEditModal;
