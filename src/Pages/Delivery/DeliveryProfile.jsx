import "../Home/HomePage.css";
import Header from "../Home/Header";
import Footer from "../Footer";
import DeliveryProfileComponent from "./DeliveryProfileComponent";

const DeliveryProfile = () => {
    return (
        <div className="homepage-container">
            <Header />
            < DeliveryProfileComponent />
            <Footer />
        </div>
    );
};

export default DeliveryProfile;
