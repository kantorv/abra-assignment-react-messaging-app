import  {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

type AlertDialogProps = {
    open: boolean,
    closeFn: ()=>void,
    message: string
}

export default function ErrorMesageDialog(props: AlertDialogProps) {
  const {open, closeFn, message} = props

  const [dialogOpen, setOpen] =  useState(false);

  useEffect(()=>{
    setOpen(open)
  },[open])

//   const handleClose = () => {
//     setOpen(false);
//   };

  return (
      <Dialog
        open={dialogOpen}
        onClose={closeFn}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Error!"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeFn} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
  );
}
