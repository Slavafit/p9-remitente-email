import React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const ImageModal = ({ modalOpen, imageUrl, handleClose }) => {
  return (
    <Modal open={modalOpen} onClose={handleClose}>
      <Box onClick={handleClose} sx={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)',
        }}
        >
        <img src={imageUrl} alt="Modal image" width="50%" height="auto" />
      </Box>
    </Modal>
  );
};

export default ImageModal;
