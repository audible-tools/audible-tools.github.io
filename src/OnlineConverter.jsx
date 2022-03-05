import React, {useState} from "react";
import Button from '@material-ui/core/Button';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import Typography from "@material-ui/core/Typography";

const downloadFile= (data, outputFileName, outputFormat) => {
    let a = document.createElement("a");
    document.body.appendChild(a);
    const blob = new Blob([data.buffer], { type: 'audio/'+outputFormat});
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = outputFileName;
    a.click();
    window.URL.revokeObjectURL(url);
}
const getCommandAsList = (file, outputFileName, outputFormat, activationBytes) =>{
    const outputFormatCodecMaps = [
        { format: "m4b", codec: "-c copy" },
        { format: "flac", codec: "-c:a flac" },
        { format: "mp3", codec: "-c:a libmp3lame" },
    ];
    const codec = outputFormatCodecMaps.filter(x => x.format === outputFormat)[0].codec;
    const filename = file.name;
    return [`-y`,
        '-activation_bytes', activationBytes,
        '-i', filename,
        codec,
        outputFileName
    ];
}
const doTranscode = async (file, outputFileName, outputFormat, activationBytes, setMessage) => {
    const ffmpeg = createFFmpeg({
        log: true,
        progress: ({ ratio }) => {
            setMessage(`Complete: ${(ratio * 100.0).toFixed(2)}%`);
        }
    });
    const command = getCommandAsList(file, outputFileName, outputFormat, activationBytes);
    setMessage('Loading ffmpeg-core.js');
    await ffmpeg.load();
    setMessage('Start transcoding');
    ffmpeg.FS('writeFile', file.name, await fetchFile(file));
    await ffmpeg.run(...command);
    setMessage('Complete transcoding');
    const data = ffmpeg.FS('readFile', outputFileName);
    downloadFile(data,outputFileName, outputFormat)
};
const OnlineConverter = (props) => {
    const {file, activationBytes, outputFormat} = props
    const [message, setMessage] = useState('Click Start to transcode');

    const downloadDisabled = !(file && activationBytes && outputFormat)

    return(
        <div>
            <Button onClick={()=>{
                let fileNameWithoutExtension = file.name.split('.').slice(0, -1).join('.');
                fileNameWithoutExtension = fileNameWithoutExtension === 'input' ? 'output' : fileNameWithoutExtension;
                const outputFileName = `${fileNameWithoutExtension}.${outputFormat}`
                return doTranscode(file,outputFileName,outputFormat,activationBytes,setMessage)
            }} variant="contained" color="primary" disabled={downloadDisabled}>Convert in Browser</Button>
            <Typography>{message}</Typography>
        </div>
    )
}

export default OnlineConverter