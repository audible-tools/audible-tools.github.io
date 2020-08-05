import React, { useState } from 'react';
import { withStyles } from "@material-ui/core/styles";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';

import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

const useStyles = theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    }
});


function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://audible-tools.github.io/">
                    audible-tools
        </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

class ChecksumResolver extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checksum: ""
        }
    }


    DarkerDisabledTextField = withStyles({
        root: {
            marginRight: 8,
            "& .MuiInputBase-root.Mui-disabled": {
                color: "rgba(0, 0, 0, 0.6)" // (default alpha is 0.38)
            }
        }
    })(TextField);

    setChecksum = (value) => {
        if (value.length > 40) {
            return;
        }
        this.setState({ checksum: value })
    }

    isChecksumValid = () => {
        const { checksum } = this.state;
        const regex = RegExp('[a-f0-9]{40}');
        const testResults = regex.test(checksum);

        return testResults;
    }

    requestActivationBytes = () => {
        const { checksum } = this.state;

        fetch("https://aaxactivationserviceapi.azurewebsites.net/api/v2/activation/" + checksum)
            .then(res => res.json())
            .then(
                (result) => {
                    const { success, activationBytes } = result;
                    if (success === true) {
                        this.setState({ activationBytes: result.activationBytes });
                    }else{
                        this.setState({ activationBytes: 'UNKNOWN' });
                    }


                },
                (error) => {
                    this.setState({ activationBytes: 'UNKNOWN' });
                    // this.setState({
                    //     isLoaded: true,
                    //     error
                    // });
                }
            )
    }

    render() {
        const { classes } = this.props;
        const { checksum, activationBytes } = this.state;

        return (
            <Container component="main" maxWidth="xs">

                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        AAX Checksum Resolver
                    </Typography>

                    <form className={classes.form} noValidate>
                        <TextField
                            error={!this.isChecksumValid()}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="checksum"
                            label="AAX Checksum"
                            name="checksum"
                            autoComplete="checksum"
                            autoFocus
                            onChange={(x) => this.setChecksum(x.target.value)}
                            value={checksum}
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => {
                                this.requestActivationBytes();
                            }}
                            disabled={!this.isChecksumValid()}
                        >
                            Request Activation Bytes
                        </Button>

                        <this.DarkerDisabledTextField
                            value={activationBytes}
                            disabled
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="activationBytes"
                            label={activationBytes?'':"Activation Bytes"}
                            name="activationBytes"
                            autoComplete="activationBytes"
                            aria-readonly

                            InputProps={{
                                readOnly: true
                            }}

                        />

                    </form>
                </div>
                <Box mt={1}>
                    <Copyright />
                </Box>
            </Container>
        );
    }
}

export default withStyles(useStyles)(ChecksumResolver);