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
//import { FilePicker } from 'react-file-picker'



import { CopyToClipboard } from 'react-copy-to-clipboard';

import ControlledAccordions from './ControlledAccordions'


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
                {'.'}
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

    requestActivationBytes = () => {
        const { checksum } = this.state;

        fetch("https://aax.api.j-kit.me/api/v2/activation/" + checksum)
            .then(res => res.json())
            .then(
                (result) => {
                    const { success, activationBytes } = result;
                    if (success === true) {
                        this.setState({ activationBytes: result.activationBytes });
                    } else {
                        this.setState({ activationBytes: 'UNKNOWN' });
                    }


                },
                (error) => {
                    this.setState({ activationBytes: 'UNKNOWN' });
                }
            )
    }

    buf2hex(buffer) { // buffer is an ArrayBuffer
        return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
    }

    acceptFile = async files => {
        const file = files[0];
        // if (!file.name.toLowerCase().endsWith(".aax")) {
        //     alert('FileType not supported!');
        //     return;
        // }

        this.setState({ fileName: file.name });
        const slic = file.slice(653, 653 + 20);
        const results = this.buf2hex(await slic.arrayBuffer());
        this.setChecksum(results)
        this.requestActivationBytes();

    }

    render() {
        const { classes } = this.props;
        const { checksum, activationBytes, fileName } = this.state;

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
                                this.acceptFile(acceptedFiles);
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
                                                readOnly: true,
//                                                 endAdornment: (
//                                                     // <IconButton onClick={() => {

//                                                     //     alert('hi')
//                                                     // }}>
//                                                     //     <PublishOutlined />
//                                                     // </IconButton>

//                                                     // <IconButton>
//                                                     //     <HiddenFileInput accept=".jpg, .jpeg, .png" multiple={false} />

//                                                     //     <PublishOutlined />
//                                                     // </IconButton>
// //accept="image/*"
//                                                     // <FilePicker
//                                                     //     accept="image/*"
//                                                     //     extensions={['aax','AAX']}
//                                                     //     acceptFile="image/*"
//                                                     //     onChange={FileObject => { }}
//                                                     //     onError={errMsg => { }}
//                                                     // >
//                                                     //     <IconButton >
//                                                     //         <PublishOutlined />
//                                                     //     </IconButton>
//                                                     // </FilePicker>
//                                                 )
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
                />
                <Box mt={1}>
                    <this.Copyright />
                </Box>


            </Container>
        );
    }
}

export default withStyles(useStyles)(ChecksumResolver);
