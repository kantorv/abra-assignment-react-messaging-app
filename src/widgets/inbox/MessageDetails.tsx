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
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';

import { Box } from '@mui/material';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import type { ApiMachineActorType } from '../../service/api/apimachine';
import { useSelector } from '@xstate/react';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';


export default function RecipeReviewCard() {
    const [expanded, setExpanded] = useState(true);
    const navigate = useNavigate()
    const goBackFn = () => navigate('/')

    const { messageId } = useParams()



    const { api_svc } = useOutletContext<{ api_svc: ApiMachineActorType }>()
    const message = useSelector(api_svc, (state) => state.context.received_messages.find((x) => x.id === messageId))

    useEffect(() => {

        console.log("message updated", message)
    }, [message])

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
                                <IconButton aria-label="settings">
                                    <ReplyIcon />
                                </IconButton>
                                <IconButton aria-label="share">
                                    <DeleteIcon fontSize='small' />
                                </IconButton>
                            </Box>
                        }
                        title={message.from}
                        subheader={message.created}
                    />



                <CardContent>

                    <Typography paragraph>
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
        </Box>
    );
}
