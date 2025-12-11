/**
 * AlertForm - 100% CONFIGURABLE
 * Mọi field đều từ config, không hardcode gì cả
 */
const AlertForm = ({ form, setForm, fields = [] }) => {
    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const renderField = (field) => {
        switch (field.type) {
            case 'text':
                return (
                    <div key={field.name} className="alert-group">
                        <label>{field.label}</label>
                        <input
                            className="alert-input"
                            value={form[field.name] || ''}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                        />
                    </div>
                );

            case 'textarea':
                return (
                    <div key={field.name} className="alert-group">
                        <label>{field.label}</label>
                        <textarea
                            rows={field.rows || 4}
                            className="alert-input"
                            value={form[field.name] || ''}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                        />
                    </div>
                );

            case 'select':
                return (
                    <div key={field.name} className="alert-group">
                        <label>{field.label}</label>
                        <select
                            className="alert-input"
                            value={form[field.name] || ''}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                        >
                            <option value="">-- Chọn --</option>
                            {field.options?.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                );

            case 'number':
                return (
                    <div key={field.name} className="alert-group">
                        <label>{field.label}</label>
                        <input
                            type="number"
                            className="alert-input"
                            value={form[field.name] || 0}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                        />
                    </div>
                );

            case 'file':
                return (
                    <div key={field.name} className="alert-group">
                        <label>{field.label}</label>
                        <input
                            type="file"
                            accept={field.accept || "image/*"}
                            className="alert-input"
                            onChange={(e) => handleChange(field.name, e.target.files[0])}
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <>
            {fields.map(field => renderField(field))}
        </>
    );
};

export default AlertForm;