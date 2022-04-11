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

        var axios = require('axios');
var data = formData;

var config = {
  method: 'post',
  url: 'http://localhost:8080/teacher/upload',
  headers: { 
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0', 
    'Accept': 'application/json, text/plain, */*', 
    'Accept-Language': 'cs,sk;q=0.8,en-US;q=0.5,en;q=0.3', 
    'Accept-Encoding': 'gzip, deflate', 
    'Content-Type': 'application/json', 
    'Origin': 'http://localhost:3000', 
    'Connection': 'keep-alive', 
    'Referer': 'http://localhost:3000/', 
    'Sec-Fetch-Dest': 'empty', 
    'Sec-Fetch-Mode': 'cors', 
    'Sec-Fetch-Site': 'same-site', 
    'Cookie': 'access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJrYXJlbC5zdm9ib2RhQGVtYWlsLmN6Iiwicm9sZSI6IlJPTEVfVEVBQ0hFUiIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9sb2dpbiIsImV4cCI6MTY1MDg1OTIwMH0.H-GQi5cCucfPGHxS7GeYWsd6VuFFBatUfU20TQunH5c', 
    ...data.getHeaders()
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});

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