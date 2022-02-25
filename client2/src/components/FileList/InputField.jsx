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

const InputField = ({editAboutMe, input ,setInput}) => {
    const classes = useStyles();

    const handleInput = (e) => {
        setInput(e.target.value);
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        editAboutMe(input);
    }

    return (
        <Paper className={classes.pageContent}>
            <form className={classes.root} autoComplete="off" onSubmit={handleSubmit}>
                <TextField
                variant="outlined"
                label="Input"
                name="test"
                value={input}
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
 
export default InputField;