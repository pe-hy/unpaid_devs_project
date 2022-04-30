import React, {useState} from 'react';

const URL = `${process.env.REACT_APP_AXIOS_URL}`;

const LIST_FILES_URL = `${URL}/teacher/listFiles`;

const FileByTeacherComponent = () => {
    const [files, setFiles] = useState('');

    //base end point url
    const FILE_DOWNLOAD_BASE_URL = URL;
    const axios = require('axios');

    const config = {
        method: 'GET',
        url: LIST_FILES_URL,
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