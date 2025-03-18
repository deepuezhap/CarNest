import React from 'react';

const WhatsAppButton = ({ phoneNumber, message = 'Hello, I need help!' }) => {
  // Construct the WhatsApp URL
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <button 
      onClick={() => window.open(whatsappUrl, '_blank')} 
      style={styles.button}
    >
      Chat with us on WhatsApp
    </button>
  );
};

const styles = {
  button: {
    backgroundColor: '#25D366', // WhatsApp green color
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default WhatsAppButton;
