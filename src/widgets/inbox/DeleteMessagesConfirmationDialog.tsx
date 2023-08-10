import  {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

type ConfirmDialogProps = {
    open: boolean,
    closeFn: ()=>void,
    confirmFn: ()=>void,
    message: string
}

export default function DeleteMessagesConfirmationDialog(props: ConfirmDialogProps) {
  const {open, closeFn,confirmFn, message} = props

  const [dialogOpen, setOpen] =  useState(false);

  useEffect(()=>{
    setOpen(open)
  },[open])

  return (
      <Dialog
        open={dialogOpen}
        onClose={closeFn}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Warning!"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeFn} autoFocus>
            Cancel
          </Button>
          <Button onClick={confirmFn}>
            Ok
          </Button>

        </DialogActions>
      </Dialog>
  );
}
