import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';



export default function OutputFormatSelection(props) {

    const { outputFormat, setOutputFormat, style } = props;
    
    const handleChange = (event) => {
       
        setOutputFormat(event.target.value);
    };

    return (
        <FormControl component="fieldset" style={style}>
            <FormLabel component="legend">Output Format</FormLabel>
            <RadioGroup aria-label="format" name="format" value={outputFormat} onChange={handleChange}>
                <FormControlLabel value="m4b" control={<Radio />} label="AAC m4b" />
                <FormControlLabel value="flac" control={<Radio />} label="FLAC hq" />
                <FormControlLabel value="mp3" control={<Radio />} label="Lame mp3" />
            </RadioGroup>
        </FormControl>
    );
}
