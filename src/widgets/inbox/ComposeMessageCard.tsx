import {useState, useEffect, forwardRef} from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';

import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';

import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Box } from '@mui/material';
import type { ApiMachineActorType } from '../../service/api/apimachine';
import { useActor } from '@xstate/react';

import ErrorMesageDialog from './ErrorMesageDialog'


const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });


type ComposeMessageCardProps = {
    apiService: ApiMachineActorType
}

const ComposeMessageCard = (props: ComposeMessageCardProps) => {

    const {apiService } = props
    const [ state, send] = useActor(apiService)

    const closeFn = ()=>send('EVENTS.UI.CLOSE_MESSAGE_EDITOR')


    const [snackbarOpen, setsSnackbarOpen] =  useState(false);
    const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
        return;
        }

        setsSnackbarOpen(false);
        closeFn()
    };
    
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);


    const to = data.get("recipient")
    const subject = data.get("subject")
    const message = data.get("message")

    const newMessage = {to,subject, message } as NewMessage


    send({
        type: 'EVENTS.API.POST_MESSAGE',
        message: newMessage
    })




    console.log(newMessage)

  };



  useEffect(()=>{
    setsSnackbarOpen(state.matches('post_message.success'))

    if(state.matches('post_message.error')){
        setErrorMessage((state.event as any).data.message)
        //setErrorMessage(state.event.data.message)
    }
  },[state])



  const [errorMessage, setErrorMessage] = useState<string>("")


    return (


        !state.matches('post_message.success')?
        <Card sx={{ maxWidth: 445, maxHeight: "70vh", display: "flex", flexDirection: "column" }}>
            <CardHeader

                action={
                    <IconButton aria-label="close" onClick={closeFn}>
                        <CloseIcon />
                    </IconButton>
                }
                title="New Message"

                sx={{
                    background: "azure",
                }}
            />
            <Divider />

            <Box
                component="form"
                sx={{
                    p: 1,
                    display: "flex",
                    
                    flexDirection: "column"
                    //'& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
               // noValidate
                autoComplete="off"
                onSubmit={handleSubmit} 
            >
                <div >
                    <TextField
                        required
                        fullWidth
                        id="recipient"
                        name="recipient"
                        label="Recipient"
                        //  defaultValue="Hello World"
                        variant="standard"
                    />

                    <TextField
                        required
                        fullWidth
                        id="subject"
                        name="subject"
                        label="Subject"
                        // defaultValue="Hello World"
                        variant="standard"
                      //  placeholder='Subject'
                    />

                <TextField
                    required
                    sx={{ mt:1, p: 0 }}
                    fullWidth
                    name="message"
                    id="standard-multiline-static"
                 //   label="Multiline"
                    multiline
                    rows={6}
                  //  defaultValue="Default Value"
                 //   variant="standard"
                />

                </div>


       

       
            <Divider sx={{mt:1, ml: -1, mr:-1 }}/>
            <CardActions disableSpacing>

                <Button variant="contained" endIcon={<SendIcon />} type='submit'>
                    Send
                </Button>
                <div style={{ flexGrow: 1 }}></div>
                <IconButton aria-label="delete" onClick={closeFn}>
                    <DeleteIcon />
                </IconButton>

            </CardActions>
            </Box>

        <ErrorMesageDialog  
            open={state.matches('post_message.error')}
            closeFn={()=>send('EVENTS.UI.CLOSE_ERROR_DIALOG')}
            message={errorMessage}
            
        />

        </Card>:
        <Snackbar 
            open={snackbarOpen} 
            autoHideDuration={6000} 
            onClose={handleSnackbarClose}
            
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right'  }}
            >
            <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
            Message sent
            </Alert>
        </Snackbar>
    );
}



export default ComposeMessageCard