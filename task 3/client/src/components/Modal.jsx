import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="glass modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>&times;</button>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>{title}</h3>
                {children}
            </div>
        </div>
    );
};

export default Modal;
