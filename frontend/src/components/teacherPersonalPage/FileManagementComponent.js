import React, {useState} from 'react';
import {FileUploader} from "react-drag-drop-files";

const FileManagementComponent = () => {
    const [files, setFiles] = useState('');
    //state for checking file size
    const [fileSize, setFileSize] = useState(true);
    // for file upload progress message
    const [fileUploadProgress, setFileUploadProgress] = useState(false);
    //for displaying response message
    const [fileUploadResponse, setFileUploadResponse] = useState(null);
    //base end point url
    const FILE_UPLOAD_BASE_ENDPOINT = "http://localhost:8080";
    const fileTypes = ["JPG", "JPEG", "PNG", "DOCX", "PDF"];
    //https://www.npmjs.com/package/react-drag-drop-files
    function DragDrop() {
        const handleChange = (file) => {
            setFiles(file);
        };
        return (
            <FileUploader maxSize={20} multiple={true} label={"Nahrejte soubor kliknutím nebo přetažením"} handleChange={handleChange} name="file" types={fileTypes} />
        );
    }

    const uploadFileHandler = (event) => {
        setFiles(event.target.files);
    };

    const fileSubmitHandler = (event) => {
        event.preventDefault();
        setFileSize(true);
        setFileUploadProgress(true);

        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            if (files[i].size > 202480) {
                setFileSize(false);
                setFileUploadProgress(false);
                setFileUploadResponse(null);
                return;
            }

            formData.append(`files`, files[i])
        }

        const axios = require('axios');
        const data = formData;

        const config = {
            method: 'POST',
            url: 'http://localhost:8080/teacher/upload',
            withCredentials: true,
            headers: {'content-type': 'application/json'},
            data: data
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                setFileUploadResponse(response.data.message);
            })
            .catch(function (error) {
                console.log(error);
            });

    };

    return (

        <div>
            <input type="file" multiple onChange={uploadFileHandler}/>
            <button onClick={fileSubmitHandler}>Upload</button>
            <div>{DragDrop()}</div>
            {!fileSize && <p style={{color: 'red'}}>File size exceeded!!</p>}
            {fileUploadProgress && <p style={{color: 'red'}}>Uploading File(s)</p>}
            {fileUploadResponse != null && <p style={{color: 'green'}}>{fileUploadResponse}</p>}
        </div>

    );
}
export default FileManagementComponent;