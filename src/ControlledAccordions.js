import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import { Accordion, AccordionDetails, AccordionSummary } from '@material-ui/core';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import IconButton from '@material-ui/core/IconButton';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FileCopyOutlined from '@material-ui/icons/FileCopyOutlined';

// import {ExpandMoreIcon, FileCopyOutlined} from '@material-ui/icons';

import OutputFormatSelection from './OutputFormatSelection'
import OSSelector from './OSSelector'

class ControlledAccordions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: "",
            outputFormat: "m4b",
            operatingSystem: "win"
        };
    }
    DarkerDisabledTextField = withStyles({
        root: {
            marginRight: 8,
            "& .MuiInputBase-root.Mui-disabled": {
                color: "rgba(0, 0, 0, 0.6)"
            }
        }
    })(TextField);

    setExpanded = x => this.setState({ expanded: x })
    handleChange = (panel) => (event, isExpanded) => {
        this.setExpanded(isExpanded ? panel : false);
    };

    getCommand = () => {
        const { outputFormat, operatingSystem } = this.state;
        let { fileName, activationBytes } = this.props;

        activationBytes = activationBytes ?? "00000000";

        // ffmpeg.exe -y -activation_bytes 9f786605 -i  '.\INFINITUM - Die Ewigkeit der Sterne.AAX' -ss 5 -to 20 -c copy out-t01.m4a
        // faster:
        // ffmpeg.exe -y -activation_bytes 9f786605 -i  '.\INFINITUM - Die Ewigkeit der Sterne.AAX' -map_metadata 0 -id3v2_version 3 -ss 5 -to 20 -vn out-t02.m4a
        // ffmpeg.exe -y -activation_bytes 9f786605 -i  '.\INFINITUM - Die Ewigkeit der Sterne.AAX' -map_metadata 0 -ss 5 -to 20 -vn out-t02.m4a

        // -vn: As an output option, disables video recording i.e. automatic selection or mapping of any video stream. For full manual control see the -map option.
        // " works on ps and cmd as discriminator

        const outputFormatCodecMaps = [
            { format: "m4b", codec: "copy" },
            { format: "flac", codec: "flac" },
            { format: "mp3", codec: "libmp3lame" },
        ];

        const osToBinMaps = [
            { os: "win", cmd: "ffmpeg.exe", discriminator: '"' },
            { os: "linux", cmd: "./ffmpeg", discriminator: '\'' },
            { os: "osx", cmd: "./ffmpeg", discriminator: '\'' },
        ];

        let fileNameWithoutExtension = fileName.split('.')[0];
        fileNameWithoutExtension = fileNameWithoutExtension === 'input' ? 'output' : fileNameWithoutExtension;

        const osMap =  osToBinMaps.filter(x => x.os === operatingSystem)[0];

        const codec = outputFormatCodecMaps.filter(x => x.format === outputFormat)[0].codec;
        const bin = osMap.cmd;
        const di = osMap.discriminator;
        
        return `${bin} -y`
            + ` -activation_bytes ${activationBytes} -i  ${di}.\\${fileName}${di}`
            + ` -map_metadata 0`
            + ` -id3v2_version 3`
            + ` -codec:a ${codec}`
            + ` -vn ${di}${fileNameWithoutExtension}.${outputFormat}${di}`;
    }

    render() {
        const { classes } = this.props;
        const { expanded, outputFormat, operatingSystem } = this.state;


        return (
            <div className={classes.root}>
                <Accordion expanded={expanded === 'panel2'} onChange={this.handleChange('panel2')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2bh-content"
                        id="panel2bh-header"
                    >
                        <Typography className={classes.heading}>Command</Typography>
                        <Typography className={classes.secondaryHeading}>
                            Generate ffmpeg command
                </Typography>
                    </AccordionSummary>
                    <AccordionDetails style={{ display: 'block' }}>
                        <OutputFormatSelection
                            outputFormat={outputFormat}
                            setOutputFormat={x => this.setState({ outputFormat: x })}
                        />

                        <OSSelector
                            operatingSystem={operatingSystem}
                            setOperatingSystem={x => this.setState({ operatingSystem: x })}
                            style={{ paddingLeft: '20px' }}
                        />

                        <this.DarkerDisabledTextField
                            value={this.getCommand()}
                            disabled
                            multiline
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="activationBytes"
                            label="cmd"
                            name="activationBytes"
                            autoComplete="activationBytes"
                            aria-readonly
                            fontSize={5}

                            InputProps={{
                                readOnly: true,
                                endAdornment: (
                                    <CopyToClipboard text={this.getCommand()}>
                                        <IconButton >
                                            <FileCopyOutlined />
                                        </IconButton>
                                    </CopyToClipboard>
                                )
                            }}

                        />
                    </AccordionDetails>
                </Accordion>
            </div>
        );
    }
}

const useStyles = theme => ({
    root: {
        width: '100%',

    },
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

export default withStyles(useStyles)(ControlledAccordions);
