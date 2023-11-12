import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import AlertTitle from '@mui/material/AlertTitle';
import Alert from '@mui/material/Alert';


  export default function Snack({ snackOpen, handleClose, title, message }) {

    let severity = 'success';
    if (title === 'warning') {
      severity = 'warning';
    } else if (title === 'error') {
      severity = 'error';
    }

    return(
        <Stack spacing={2} sx={{ width: '100%' }}>
            <Snackbar 
                open={snackOpen}
                onClose={handleClose}
                autoHideDuration={6000}
                 >
                <Alert severity={severity} variant="filled">
                    <AlertTitle>{title}</AlertTitle>
                        {message}
                </Alert>
            </Snackbar>
        </Stack>
    )
}