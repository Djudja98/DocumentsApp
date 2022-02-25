import { TextField, Paper, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme =>({
    pageContent: {
        width: '75%',
        margin: theme.spacing(5),
        padding: theme.spacing(3)
    },
    button: {
        margin: theme.spacing(1)
    },
    root:{
        '& .MuiFormControl-root':{
            width: '100%',
            margin: theme.spacing(1)
        }
    }
}))

const UpdateProfileForm = ({editAboutMe, userInfoEdit ,setUserInfoEdit}) => {
    const classes = useStyles();

    const handleInput = (e) => {
        const {name, value} = e.target;
        setUserInfoEdit({
            ...userInfoEdit,
            [name]:value
        })
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        editAboutMe(userInfoEdit);
    }

    return (
        <Paper className={classes.pageContent}>
            <form className={classes.root} autoComplete="off" onSubmit={handleSubmit}>
                <TextField
                variant="outlined"
                label="AccountType"
                name="accountType"
                value={userInfoEdit.accountType}
                onChange={handleInput}
                />
                <TextField
                variant="outlined"
                label="MyDirectory"
                name="myDirectory"
                value={userInfoEdit.myDirectory}
                onChange={handleInput}
                />
                <TextField
                variant="outlined"
                label="AllowedIp"
                name="allowedIp"
                value={userInfoEdit.allowedIp}
                onChange={handleInput}
                />
                <TextField
                variant="outlined"
                label="ReadAction"
                name="readAction"
                value={userInfoEdit.readAction}
                onChange={handleInput}
                />
                <TextField
                variant="outlined"
                label="CreateAction"
                name="createAction"
                value={userInfoEdit.createAction}
                onChange={handleInput}
                />
                <TextField
                variant="outlined"
                label="UpdateAction"
                name="updateAction"
                value={userInfoEdit.updateAction}
                onChange={handleInput}
                />
                <TextField
                variant="outlined"
                label="DeleteAction"
                name="deleteAction"
                value={userInfoEdit.deleteAction}
                onChange={handleInput}
                />
                <div>
                <Button
                className={classes.button}
                variant="contained"
                size="large"
                color="primary"
                type="submit"
                onClick={handleSubmit}
                >
                Submit
                </Button>
                </div>
            </form>
        </Paper>
    );
}
 
export default UpdateProfileForm;