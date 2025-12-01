import React, { useState } from "react";
import "./Footer.css";
import logo from "../../../../assets/logo.png";

const Footer = () => {
    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) return;

        setSuccess(true);
        setEmail("");

        setTimeout(() => {
            setSuccess(false);
        }, 3000);
    };

    return (
        <footer className="footer-container">

            <div className="footer-content">

                {/* LEFT */}
                <div className="footer-col footer-left">
                    <img src={logo} alt="Brand Logo" className="footer-logo" />
                    <p>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        Lorem Ipsum has been the industry's standard dummy text.
                    </p>
                </div>

                {/* MIDDLE */}
                <div className="footer-col footer-middle">
                    <h3>Company</h3>
                    <ul>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">About us</a></li>
                        <li><a href="#">Contact us</a></li>
                        <li><a href="#">Privacy policy</a></li>
                    </ul>
                </div>

                {/* RIGHT */}
                <div className="footer-col footer-right">
                    <h3>Subscribe to our newsletter</h3>
                    <p>
                        The latest news, articles, and resources, sent to your inbox weekly.
                    </p>

                    <form className="footer-form" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button type="submit">Subscribe</button>
                    </form>

                    {success && <p className="success-text">Thank you for subscribing!</p>}
                </div>

            </div>

            {/* BOTTOM */}
            <div className="footer-bottom">
                Copyright 2025 © HCMIU. All Rights Reserved
            </div>

        </footer>
    );
};

export default Footer;
