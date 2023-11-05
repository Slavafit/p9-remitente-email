import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function ShowBackdrop({loading, setLoading}) {
  const handleClose = () => {
    setLoading(false);
  };


  return (
    <div>
      <Backdrop
        // sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        onClick={handleClose}
      >
        <CircularProgress sx={{ color: '#dc001b'}}/>
      </Backdrop>
    </div>
  );
}