import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';

import { Box } from '@mui/material';

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));



type ComposeMessageCardProps = {
    closeFn: () => void
}

const ComposeMessageCard = (props: ComposeMessageCardProps) => {

    const { closeFn } = props

    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
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
                    p: 1
                    //'& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <div >
                    <TextField
                        required
                        fullWidth
                        id="recipient"
                        label="Recipient"
                        //  defaultValue="Hello World"
                        variant="standard"
                    />

                    <TextField
                        required
                        fullWidth
                        id="subject"
                        label="Subject"
                        // defaultValue="Hello World"
                        variant="standard"
                      //  placeholder='Subject'
                    />

                <TextField
                    sx={{ mt:2, border: "0 none" }}
                    fullWidth
                    id="standard-multiline-static"
                 //   label="Multiline"
                    multiline
                    rows={6}
                  //  defaultValue="Default Value"
                 //   variant="standard"
                />

                </div>


            </Box>

       
            <div style={{ flexGrow: 1 }}></div>
            <Divider />
            <CardActions disableSpacing>

                <Button variant="contained" endIcon={<SendIcon />}>
                    Send
                </Button>
                <div style={{ flexGrow: 1 }}></div>
                <IconButton aria-label="delete" onClick={closeFn}>
                    <DeleteIcon />
                </IconButton>

            </CardActions>



        </Card>
    );
}



export default ComposeMessageCard