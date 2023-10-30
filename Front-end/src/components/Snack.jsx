import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
// import MuiAlert, { AlertProps } from '@mui/material/Alert';



function Snack({ snackOpen, handleClose, message }) {
    return(
        <Stack spacing={2} sx={{ width: '100%' }}>
            <Snackbar 
                open={snackOpen}
                onClose={handleClose}
                autoHideDuration={4000}
                 >
                <Alert severity="info">
                    {message}
                </Alert>
            </Snackbar>
        </Stack>
    )
}
export default Snack;