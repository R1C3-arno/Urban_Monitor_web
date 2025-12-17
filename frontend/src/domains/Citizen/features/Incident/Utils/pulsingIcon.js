// Helper: hex to rgb for pulsing effect
export const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
};

// Create pulsing icon - uses color from backend
export const createPulsingIcon = (color, size, mapRef) => ({
    width: size,
    height: size,
    data: new Uint8Array(size * size * 4),
    onAdd: function() {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
    },
    render: function() {
        const duration = 1000;
        const t = (performance.now() % duration) / duration;
        const radius = (size / 2) * 0.3;
        const outerRadius = (size / 2) * 0.7 * t + radius;
        const context = this.context;

        context.clearRect(0, 0, this.width, this.height);

        context.beginPath();
        context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
        context.fillStyle = `rgba(${hexToRgb(color)}, ${1 - t})`;
        context.fill();

        context.beginPath();
        context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
        context.fillStyle = color;
        context.strokeStyle = 'white';
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();

        this.data = context.getImageData(0, 0, this.width, this.height).data;
        mapRef.current.triggerRepaint();
        return true;
    }
});
