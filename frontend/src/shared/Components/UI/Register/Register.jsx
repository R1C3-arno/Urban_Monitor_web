import React, {useState} from "react";
import "./Register.css";
import Modal from "../Modal/Modal.jsx";
import Button from "../Button/Button.jsx";
import PopupFrame from "../PopUpFrame/PopUpFrame.jsx";

const Register = ({
                      isOpen,
                      onClose,
                      title = "Đăng ký",
                      onSubmit,
                      onOpenLogin,
                  }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Mật khẩu không khớp!");
            return;
        }

        onSubmit?.({
            name: "Test User",
            email,
            password,
            avatar: avatarDefault
        });
    };


    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <PopupFrame
                title="Register"
                className="popup-register"
                footer={
                    <p>
                        Already have an account?{" "}
                        <span className="link" onClick={onOpenLogin}>
                            Login
                        </span>
                    </p>
                }
            >
                <form onSubmit={handleSubmit}>
                    <input
                        className="register-input"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        className="register-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <input
                        className="register-input"
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <Button
                        variant="primary"
                        size="md"
                        style={{width: "100%", marginTop: "1rem"}}
                        type="submit"
                    >
                        Register
                    </Button>
                </form>
            </PopupFrame>
        </Modal>
    );
};

export default Register;
