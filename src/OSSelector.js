import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';



export default function OSSelector(props) {

    const { operatingSystem, setOperatingSystem, style } = props;

    const handleChange = (event) => setOperatingSystem(event.target.value);

    return (
        <FormControl component="fieldset" style={style}>
            <FormLabel component="legend">Operating System</FormLabel>
            <RadioGroup aria-label="format" name="format" value={operatingSystem} onChange={handleChange}>
                <FormControlLabel value="win" control={<Radio />} label="Windows" />
                <FormControlLabel value="linux" control={<Radio />} label="Linux" />
                <FormControlLabel value="osx" control={<Radio />} label="Mac" />
            </RadioGroup>
        </FormControl>
    );
}
