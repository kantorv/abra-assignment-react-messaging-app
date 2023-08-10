import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';

import { Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import DeleteMessagesConfirmationDialog from './DeleteMessagesConfirmationDialog'
import { useSelector } from '@xstate/react';
import { useApiService } from '.';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';


export default function ReceivedMessageDetrails() {
    const navigate = useNavigate()
    const goBackFn = () => navigate('/sent')

    const { messageId } = useParams()
    const {apiService} = useApiService()

    const message = useSelector(apiService, (state) => state.context.sent_messages.find((x) => x.id === messageId))

    useEffect(() => {

        console.log("message updated", message)
        if(undefined === message){
            closeDeleteConfirmationDialogFn()
            goBackFn()
        }

    }, [message])


    const [showDeleteConfirmationDialog, setShowDeleteConfirmationDialog] = useState(false)
    const openDeleteConfirmationDialogFn = ()=>setShowDeleteConfirmationDialog(true)
    const closeDeleteConfirmationDialogFn = ()=>setShowDeleteConfirmationDialog(false)
    const confirmDeleteFn = ()=>apiService.send({
      type: 'EVENTS.API.DELETE_SENT_MESSAGES',
      ids: [messageId as string]
    })
  

    

    return (

        <Box>
            {message ?

                <Card sx={{ maxWidth: "100%" }}>
                    <CardActions disableSpacing>
                        <IconButton aria-label="back" onClick={goBackFn} >
                            <ArrowBackIcon fontSize='small' />
                        </IconButton>
                        <Box sx={{ flexGrow: 1 }}></Box>


                    </CardActions>

                    <CardContent>
                        <Typography variant='h4'>{message.subject}</Typography>
                    </CardContent>




                    <CardHeader
                        avatar={
                            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                {message.from.charAt(0).toUpperCase()}
                            </Avatar>
                        }
                        action={
                            <Box>
                                <IconButton aria-label="reply" disabled>
                                    <ReplyIcon />
                                </IconButton>
                                <IconButton aria-label="delete" onClick={openDeleteConfirmationDialogFn}>
                                    <DeleteIcon fontSize='small' />
                                </IconButton>
                            </Box>
                        }
                        title={message.from}
                        subheader={message.created}
                    />



                <CardContent>

                    <Typography component={"div"}>
                        <pre style={{ whiteSpace:"pre-wrap"}}>
                       {message.message}
                       </pre>
                    </Typography>
                </CardContent>
                     
                </Card>

                :
                 <Stack sx={{ width: '100%' }} spacing={2}>
                    <Alert severity="warning">Message not found</Alert>
                </Stack>}

            
            <DeleteMessagesConfirmationDialog  
                open={showDeleteConfirmationDialog}
                closeFn={closeDeleteConfirmationDialogFn}
                message={`Message will be deleted!`}
                confirmFn={confirmDeleteFn}
                
            /> 
        </Box>
    );
}
