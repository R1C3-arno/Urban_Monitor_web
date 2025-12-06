const AlertForm = ({ form, setForm }) => {
    return (
        <>
            {/* Title */}
            <div className="alert-group">
                <label>Tiêu đề</label>
                <input
                    className="alert-input"
                    value={form.title}
                    onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                    }
                />
            </div>

            {/* Upload image */}
            <div className="alert-group">
                <label>Ảnh</label>
                <input
                    type="file"
                    accept="image/*"
                    className="alert-input"
                    onChange={(e) =>
                        setForm({ ...form, image: e.target.files[0] })
                    }
                />
            </div>

            {/* Select type */}
            <div className="alert-group">
                <label>Loại</label>
                <select
                    className="alert-input"
                    value={form.type}
                    onChange={(e) =>
                        setForm({ ...form, type: e.target.value })
                    }
                >
                    <option value="">-- Chọn loại --</option>
                    <option value="event">Sự kiện</option>
                    <option value="warning">Cảnh báo</option>
                    <option value="news">Tin tức</option>
                </select>
            </div>

            {/* Description */}
            <div className="alert-group">
                <label>Mô tả</label>
                <textarea
                    rows={4}
                    placeholder="Nhập mô tả..."
                    className="alert-input"
                    value={form.description}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                />
            </div>
        </>
    );
};

export default AlertForm;
