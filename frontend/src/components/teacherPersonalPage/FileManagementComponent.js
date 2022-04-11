import React, { useState } from 'react';

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
            if (files[i].size > 10240){
                setFileSize(false);
                setFileUploadProgress(false);
                setFileUploadResponse(null);
                return;
            }

            formData.append(`files`, files[i])
        }

        const requestOptions = {
            headers: { 'content-type': 'application/json' },
            method: 'POST',
            body: formData,
            withCredentials: true,
        };
        fetch(FILE_UPLOAD_BASE_ENDPOINT+'/teacher/upload', requestOptions)
            .then(async response => {
                const isJson = response.headers.get('content-type')?.includes('application/json');
                const data = isJson && await response.json();

                // check for error response
                if (!response.ok) {
                    // get error message
                    const error = (data && data.message) || response.status;
                    setFileUploadResponse(data.message);
                    return Promise.reject(error);
                }

                console.log(data.message);
                setFileUploadResponse(data.message);
            })
            .catch(error => {
                console.error('Error while uploading file!', error);
            });
        setFileUploadProgress(false);
    };

    return(

        <form onSubmit={fileSubmitHandler}>
            <input type="file"  multiple onChange={uploadFileHandler}/>
            <button type='submit'>Upload</button>
            {!fileSize && <p style={{color:'red'}}>File size exceeded!!</p>}
            {fileUploadProgress && <p style={{color:'red'}}>Uploading File(s)</p>}
            {fileUploadResponse!=null && <p style={{color:'green'}}>{fileUploadResponse}</p>}
        </form>

    );
}
export default FileManagementComponent;