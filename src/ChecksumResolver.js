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

import Dropzone from 'react-dropzone'
import IconButton from '@material-ui/core/IconButton';
import FileCopyOutlined from '@material-ui/icons/FileCopyOutlined';
import PublishOutlined from '@material-ui/icons/PublishOutlined';

// import { useFilePicker } from 'react-sage'
// import { FilePicker } from 'react-file-picker'

import { FilePicker } from '../src/Components'


import { CopyToClipboard } from 'react-copy-to-clipboard';

import ControlledAccordions from './ControlledAccordions'
import OnlineConverter from "./OnlineConverter";
import 'react-notifications-component/dist/theme.css'

import ReactNotification from 'react-notifications-component'
import { store } from 'react-notifications-component';
// import 'animate.css/animate.compat.css'

import AaxHashAlgorithm from './Utils/AaxHashAlgorithm'


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
    },

    //Accordeon
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
});

class ChecksumResolver extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checksum: "",
            fileName: "input.aax"
        }
    }

    DarkerDisabledTextField = withStyles({
        root: {
            marginRight: 8,
            "& .MuiInputBase-root.Mui-disabled": {
                color: "rgba(0, 0, 0, 0.6)"
            }
        }
    })(TextField);

    Copyright = (function () {
        return (
            <Typography variant="body2" color="textSecondary" align="center">
                {'Copyright © '}
                <Link color="inherit" href="https://audible-tools.github.io/">
                    audible-tools
            </Link>{' '}
                {new Date().getFullYear()}
                {'. V 0.1'}
            </Typography>
        );
    })

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

    isInputInvalid = () => {
        const { checksum } = this.state;
        if (!checksum || checksum === '') {
            return false;
        }
        return !this.isChecksumValid();
    };

    addNotification = function (text, success = true) {
        store.addNotification({
            message: text,
            type: success ? "success" : "danger",
            // type: "danger",
            insert: "bottom-left",
            container: "top-full",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
                duration: 3000,
                onScreen: false
            }
        });
    }

    requestActivationBytes = async () => {
        const { checksum } = this.state;
        try {
            let request = await fetch("https://aax.api.j-kit.me/api/v2/activation/" + checksum);
            let result = await request.json();
            const { success, activationBytes } = result;

            if (success !== true) {
                this.setState({ activationBytes: 'UNKNOWN' });
                this.addNotification("An error occured while resolving the activation bytes, please check your inputs", false);
                return;
            }

            if (success === true) {
                const calculatedChecksum = await AaxHashAlgorithm.CalculateChecksum(activationBytes);
                if (calculatedChecksum == checksum) {
                    this.setState({ activationBytes: activationBytes });
                    this.addNotification("Successfully resolved the activation bytes");
                    return;
                }
                
                this.setState({ activationBytes: "API ERROR" });
                this.addNotification("An unexpected error occured while resolving the activation bytes, please try again", false);

            }
        } catch (error) {
            this.setState({ activationBytes: error });
            this.addNotification("An error occured while resolving the activation bytes, please check your inputs", false);
        }
    }

    buf2hex(buffer) { // buffer is an ArrayBuffer
        return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
    }

    acceptFiles = async files => {
        const file = files[0];
        await this.acceptFile(file);
    }

    acceptFile = async file => {
        // if (!file.name.toLowerCase().endsWith(".aax")) {
        //     alert('FileType not supported!');
        //     return;
        // }

        this.setState({ fileName: file.name, file:file });
        const slic = file.slice(653, 653 + 20);
        const results = this.buf2hex(await slic.arrayBuffer());
        this.setChecksum(results)
        this.requestActivationBytes();

    }

    render() {
        const { classes } = this.props;
        const { checksum, activationBytes, fileName, file } = this.state;

        // const { files, onClick, errors, HiddenFileInput } = useFilePicker({
        //     maxFileSize: 1000000,
        //     maxImageWidth: 1000,
        //     imageQuality: 0.92,
        //     resizeImage: true
        //   });

        return (
            <Container component="main" maxWidth="md">

                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        AAX Checksum Resolver
                    </Typography>

                    <form className={classes.form} noValidate>
                        <Dropzone
                            noClick
                            onDrop={acceptedFiles => {
                                console.log(acceptedFiles);
                                this.acceptFiles(acceptedFiles);
                            }}>
                            {({ getRootProps, getInputProps }) => (
                                <section>
                                    <div {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        <TextField
                                            error={this.isInputInvalid()}
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="checksum"
                                            label="Checksum or Drag&Drop .aax file -"
                                            name="checksum"
                                            autoComplete="checksum"
                                            autoFocus
                                            onChange={(x) => this.setChecksum(x.target.value)}
                                            value={checksum}
                                            InputProps={{
                                                readOnly: false,
                                                endAdornment: (
                                                    <FilePicker
                                                        extensions={['aax', 'AAX']}
                                                        maxSize={99999}
                                                        onChange={this.acceptFile}
                                                    >
                                                        <IconButton >
                                                            <PublishOutlined />
                                                        </IconButton>
                                                    </FilePicker>
                                                )
                                            }}

                                        />
                                    </div>
                                </section>
                            )}
                        </Dropzone>

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
                            label={activationBytes ? '' : "Activation Bytes"}
                            name="activationBytes"
                            autoComplete="activationBytes"
                            aria-readonly

                            InputProps={{
                                readOnly: true,
                                endAdornment: (
                                    <CopyToClipboard text={activationBytes}>
                                        <IconButton >
                                            <FileCopyOutlined />
                                        </IconButton>
                                    </CopyToClipboard>
                                )
                            }}

                        />

                    </form>
                </div>
                <ControlledAccordions
                    fileName={fileName}
                    activationBytes={activationBytes}
                    file ={file}
                />
                <Box mt={1}>
                    <this.Copyright />
                </Box>



            </Container>
        );
    }
}

export default withStyles(useStyles)(ChecksumResolver);
