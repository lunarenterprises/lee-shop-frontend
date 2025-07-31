import React, { useState } from "react";
import "./NearbyShop.css";
import "../Home/HomePage.css";
import Footer from "../Footer";
import Header from "../Home/Header";
import JoinLeeShop from "../JoinLeeShop";
import LocationSearchBar from "../LocationSearchBar";
import ShopCard from "../ShopCard";
import ShopDetailCard from "../Service/ShopDetailCard"; // or wherever you keep it

const API_BASE_URL = "https://lunarsenterprises.com:6031/leeshop";

const NearbyShop = () => {
    const [searchedShop, setSearchedShop] = useState(null);
    const [searchedShopList, setSearchedShopList] = useState([]);
    const [searching, setSearching] = useState(false);

    // Search handler -- identical logic to HomePage!
    const handleShopSearch = async (searchTerm) => {
        if (!searchTerm || !searchTerm.trim()) {
            setSearchedShop(null);
            setSearchedShopList([]);
            return;
        }
        setSearching(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/shop/list/shop`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ search: searchTerm, sh_shop_or_service: "shop" })
                }
            );
            const resData = await response.json();
            let found = null;
            if (resData.result && Array.isArray(resData.list) && resData.list.length) {
                found =
                    resData.list.find(
                        (shop) =>
                            shop.sh_name &&
                            shop.sh_name.toLowerCase().includes(searchTerm.toLowerCase())
                    ) || resData.list[0];
                setSearchedShopList(resData.list);
            } else {
                setSearchedShopList([]);
            }
            setSearchedShop(found || { error: "No matching shop found." });
        } catch (e) {
            setSearchedShopList([]);
            setSearchedShop({ error: "Failed to fetch shop. Try again." });
        }
        setSearching(false);
    };

    return (
        <div className="homepage-container">
            <Header />
            <div className="homepage-hero">
                <LocationSearchBar onSearch={handleShopSearch} />
            </div>
            {searching ? (
                <div style={{ padding: 44, textAlign: "center" }}>Searching...</div>
            ) : searchedShop ? (
                <div className="shop-list-section">
                    {searchedShop.error ? (
                        <div style={{ padding: 40, textAlign: "center", color: "#F43F5E" }}>
                            {searchedShop.error}
                        </div>
                    ) : (
                        <ShopDetailCard shop={searchedShop} shopsList={searchedShopList} />
                    )}
                </div>
            ) : (
                <div className="shop-list-section">
                    <ShopCard />
                </div>
            )}
            <JoinLeeShop />
            <Footer />
        </div>
    );
};

export default NearbyShop;
