import React, { useState } from "react";
import Footer from "../Footer";
import Header from "../Home/Header";
import JoinLeeShop from "../JoinLeeShop";
import LocationSearchBar from "../LocationSearchBar";
import ServiceList from "../ServiceList";            // Your default "many services" grid
import ShopDetailCard from "../Service/ShopDetailCard"; // Your detail card; works for both services/shops

const API_BASE_URL = "https://lunarsenterprises.com:6031/leeshop";

const NearbyService = () => {
    const [searchedService, setSearchedService] = useState(null);
    const [searchedServiceList, setSearchedServiceList] = useState([]);
    const [searching, setSearching] = useState(false);

    const handleServiceSearch = async (searchTerm) => {
        if (!searchTerm || !searchTerm.trim()) {
            setSearchedService(null);
            setSearchedServiceList([]);
            return;
        }
        setSearching(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/shop/list/shop`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ search: searchTerm, sh_shop_or_service: "service" })
                }
            );
            const resData = await response.json();
            let found = null;
            if (resData.result && Array.isArray(resData.list) && resData.list.length) {
                found = resData.list.find(
                    (service) =>
                        service.sh_name &&
                        service.sh_name.toLowerCase().includes(searchTerm.toLowerCase())
                ) || resData.list[0];
                setSearchedServiceList(resData.list); // For sidebar/similar
            } else {
                setSearchedServiceList([]);
            }
            setSearchedService(found || { error: "No matching service found." });
        } catch (e) {
            setSearchedServiceList([]);
            setSearchedService({ error: "Failed to fetch service. Try again." });
        }
        setSearching(false);
    };

    return (
        <div className="homepage-container">
            <Header />
            <div className="homepage-hero">
                <LocationSearchBar onSearch={handleServiceSearch} />
            </div>
            {searching ? (
                <div style={{ padding: 44, textAlign: "center" }}>Searching...</div>
            ) : searchedService ? (
                <div className="shop-list-section">
                    {searchedService.error ? (
                        <div style={{ padding: 40, textAlign: "center", color: "#F43F5E" }}>
                            {searchedService.error}
                        </div>
                    ) : (
                        <ShopDetailCard
                            shop={searchedService}
                            shopsList={searchedServiceList}
                        />
                    )}
                </div>
            ) : (
                <div className="shop-list-section">
                    <ServiceList />
                </div>
            )}
            <JoinLeeShop />
            <Footer />
        </div>
    );
};

export default NearbyService;
