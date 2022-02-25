import {Button, Dialog, DialogContent, DialogTitle, makeStyles, Typography} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme =>({
    dialogWrapper:{
        padding: theme.spacing(2),
        position: 'absolute',
        top: theme.spacing(5)
    }
}))

const PopupEdit = (props) => {

    const {title, children, openPopup, setOpenPopup} = props;
    const classes = useStyles();

    return (
        <Dialog open={openPopup} maxWidth="md" className={classes.dialogWrapper}>
            <DialogTitle>
                <div style={{display: 'flex'}}>
                    <Typography variant="h6" component="div" style={{flexGrow:1}}>
                        {title}
                    </Typography>
                    <Button 
                    color="secondary"
                    onClick={() => {setOpenPopup(false)}}>
                        <CloseIcon />
                    </Button>
                </div>
            </DialogTitle>
            <DialogContent dividers>
                {children}
            </DialogContent>
        </Dialog>
    );
}
 
export default PopupEdit;