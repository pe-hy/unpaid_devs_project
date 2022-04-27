import React, {useState} from 'react';

const FileByTeacherComponent = () => {
    const [files, setFiles] = useState('');

    //base end point url
    const FILE_DOWNLOAD_BASE_URL = "http://localhost:8080";
    const axios = require('axios');

    const config = {
        method: 'GET',
        url: 'http://localhost:8080/teacher/listFiles',
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

    return (
        <div>{files}</div>
    );
}
export default FileByTeacherComponent;