import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import MuiAlert from '@mui/material/Alert';


// const Alert = React.forwardRef(function Alert(props, ref) {
//     return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
//   });


  export default function Snack({ snackOpen, handleClose, message }) {
    return(
        <Stack spacing={2} sx={{ width: '100%' }}>
            <Snackbar 
                open={snackOpen}
                onClose={handleClose}
                autoHideDuration={5000}
                 >
                <Alert severity="info" variant="filled">
                    {message}
                </Alert>
            </Snackbar>
        </Stack>
    )
}