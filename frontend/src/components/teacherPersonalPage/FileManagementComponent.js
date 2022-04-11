import React, {useState} from 'react';

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

    const uploadFileHandler = (event) => {
        setFiles(event.target.files);
    };


    const fileSubmitHandler = (event) => {
        event.preventDefault();
        setFileSize(true);
        setFileUploadProgress(true);
        setFileUploadResponse(null);

        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            if (files[i].size > 10240) {
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
            })
            .catch(function (error) {
                console.log(error);
            });

    };

    return (

        <div>
            <input type="file" multiple onChange={uploadFileHandler}/>
            <button onClick={fileSubmitHandler}>Upload</button>
            {!fileSize && <p style={{color: 'red'}}>File size exceeded!!</p>}
            {fileUploadProgress && <p style={{color: 'red'}}>Uploading File(s)</p>}
            {fileUploadResponse != null && <p style={{color: 'green'}}>{fileUploadResponse}</p>}
        </div>

    );
}
export default FileManagementComponent;