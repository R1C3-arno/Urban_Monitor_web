import "./Alert.css";
import Modal from "../Modal/Modal.jsx";
import Card from "../Card/Card.jsx";
import Circle from "../Circle/Circle.jsx";
import Button from "../Button/Button.jsx";
import AlertForm from "./AlertForm/AlertForm.jsx";

/**
 * Alert - Pass fields array to AlertForm
 */
const Alert = ({
                   isOpen,
                   inline = false,
                   title = "Xác nhận",
                   message = "Bạn có chắc chắn không?",
                   onClose,
                   onSubmit,
                   form,
                   setForm,
                   fields = [],  // ✅ Array of field configs
                   // ✅ OVERRIDE TOÀN BỘ FOOTER
                   footerContent = null,

                   // ✅ TEXT NÚT LINH HOẠT
                   confirmText = "Xác nhận",
                   cancelText = "Hủy",

               }) => {
    const defaultFooter = (
        <div className="alert-actions">
            <Button variant="secondary" onClick={onClose}>
                {cancelText}
            </Button>
            <Button variant="primary" onClick={onSubmit}>
                {confirmText}
            </Button>
        </div>
    );
    if (inline) {
        return (
            <div className="alert-inline">
                <h4>{title}</h4>
                <p>{message}</p>

                <AlertForm
                    form={form}
                    setForm={setForm}
                    fields={fields}  // ✅ Pass fields
                />

                <div className="alert-actions">
                    {footerContent || defaultFooter}
                </div>
            </div>
        );
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            footer={footerContent || defaultFooter}
            size="md"
        >
            <Card className="alert-card">
                <div className="alert-header">
                    <Circle size="small"/>
                    <div className="alert-title">{message}</div>
                </div>

                <AlertForm
                    form={form}
                    setForm={setForm}
                    fields={fields}  // ✅ Pass fields
                />
            </Card>
        </Modal>
    );
};

export default Alert;