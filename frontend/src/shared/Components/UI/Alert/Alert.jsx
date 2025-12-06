import "./Alert.css";
import Modal from "../Modal/Modal.jsx";
import Card from "../Card/Card.jsx";
import Circle from "../Circle/Circle.jsx";
import Button from "../Button/Button.jsx";
import AlertForm from "./AlertForm/AlertForm.jsx";


const Alert = ({
                   isOpen,
                   inline = false,   // ✅ QUAN TRỌNG
                   title = "Xác nhận",
                   message = "Bạn có chắc chắn không?",
                   onClose,
                   onSubmit,
                   form,
                   setForm,
               }) => {
    // ✅ INLINE MODE → KHÔNG DÙNG MODAL
    if (inline) {
        return (
            <div className="alert-inline">
                <h4>{title}</h4>
                <p>{message}</p>
                <AlertForm form={form} setForm={setForm} />


                <div className="alert-actions">
                    <Button onClick={onClose}>Hủy</Button>
                    <Button variant="primary" onClick={onSubmit}>
                        Xác nhận
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Thêm cảnh báo"
            footer={
                <div className="alert-actions">
                    <Button variant="secondary" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={onSubmit}>
                        Thêm mới
                    </Button>
                </div>
            }
            size="md"
        >
            <Card className="alert-card">
                <div className="alert-header">
                    <Circle size="small"/>
                    <div className="alert-title">Nội dung cảnh báo</div>
                </div>

                <AlertForm form={form} setForm={setForm} />
            </Card>
        </Modal>
    );
};
export default Alert;