import React, { useState } from "react";
import "./Login.css";
import Modal from "../Modal/Modal.jsx";
import Button from "../Button/Button.jsx";
import PopupFrame from "../PopUpFrame/PopUpFrame.jsx";

import ybrookie from "../../../../assets/ybrookie.jpg";



const Login = ({
                   isOpen,
                   onClose,
                   title = "Login",
                   onSubmit,
                   onOpenRegister, // callback mở Register từ Navbar
               }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const handleSubmit = (e) => {
        e.preventDefault();

        onSubmit?.({
            name: "Test",
            email,
            password,
            avatar: ybrookie
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <PopupFrame
                title="Login"
                className="popup-login"
                footer={
                    <p>
                        Do not have an account?{" "}
                        <span className="link" onClick={onOpenRegister}>
                            Register
                        </span>
                    </p>
                }
            >
                <form onSubmit={handleSubmit}>
                    <input
                        className="login-input"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        className="login-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button
                        variant="primary"
                        size="md"
                        style={{ width: "100%", marginTop: "1rem" }}

                        type="submit"
                    >
                        Login
                    </Button>
                </form>
            </PopupFrame>
        </Modal>
    );
};

export default Login;
