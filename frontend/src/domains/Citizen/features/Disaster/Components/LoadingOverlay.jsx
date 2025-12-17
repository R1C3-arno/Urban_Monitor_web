const LoadingOverlay = () => {
    return (
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0,0,0,0.8)',
            padding: '20px 40px',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '16px',
            zIndex: 10
        }}>
            Loading Vietnam Disaster Map...
        </div>
    );
};

export default LoadingOverlay;
