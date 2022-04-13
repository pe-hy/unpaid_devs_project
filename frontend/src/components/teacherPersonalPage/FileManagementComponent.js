import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import "./FileManagementComponent.css";
import axios from 'axios'


const FileManagementComponent = () => {
    const [files, setFiles] = useState('');
    //state for checking file size
    const [fileSize, setFileSize] = useState(true);
    // for file upload progress message
    const [fileUploadProgress, setFileUploadProgress] = useState(false);
    //for displaying response message
    const [fileUploadResponse, setFileUploadResponse] = useState(null);

    const [messageColor, setMessageColor] = useState("green");

    //base end point url
    const FILE_UPLOAD_BASE_ENDPOINT = "http://localhost:8080";
    const fileTypes = ["JPG", "JPEG", "PNG", "DOCX", "PDF"];
    //https://www.npmjs.com/package/react-drag-drop-files

    function unitConversion(size) {
        let ret;
        ret = size / 1000000 > 1 ? size / 1000000 : size / 1000;
        return Math.round((ret + Number.EPSILON) * 100) / 100

    }

    useEffect(() => {
        setFileUploadProgress(null);
      }, []);

    function Basic(props) {

        const uploadFiles = () => {

            setFileUploadProgress(true);

            let formData = new FormData();

            for (var i = 0; i < acceptedFiles.length; i++) {
                if (acceptedFiles[i].size > 20248000) {
                    setFileSize(false);
                    setFileUploadProgress(false);
                    setFileUploadResponse(null);
                    return;
                }
                let file = acceptedFiles[i];
                formData.append('files', file);
            }


            axios({
                method: 'POST',
                url: 'http://localhost:8080/teacher/upload',
                withCredentials: true,
                headers: { 'content-type': 'application/json' },
                data: formData,
            }).then(function (response) {
                setMessageColor("green");
                console.log(JSON.stringify(response.data));
                setFileUploadResponse(response.data.message);
                setFileUploadProgress(false);
            })
                .catch(function (error) {
                    console.log(error);
                    setMessageColor("red");
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                    setFileUploadResponse(resMessage);
                    setFileUploadProgress(false);
                });
        }
        const { acceptedFiles, getRootProps, fileRejections, getInputProps } = useDropzone({
            accept: 'image/jpeg, image/png, image/png, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/plain, application/pdf'
        });
    

        const files = acceptedFiles.map(file => (
            <li key={file.path}>
                {file.path}
                - {unitConversion(file.size)} {file.size / 1000000 > 1 ? "MB" : "kB"}
            </li>
        ));

        const fileRejectionItems = fileRejections.map(({ file, errors }) => (
            <li key={file.path}>
                {file.path}
                - {unitConversion(file.size)} {file.size / 1000000 > 1 ? "MB" : "kB"}
              <ul>
                {errors.map(e => (
                  <li key={e.code}>{"Nepovolená přípona souboru."}</li>
                ))}
              </ul>
            </li>
          ));


        return (
            <section className="container">
                <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <p>Přetáhnětě soubory zde nebo klikněte a vyberte soubor</p>
                    <p>Povolené přípony: .png, .jpg, .jpeg, .docx, .txt, .pdf</p>
                </div>
                {(files.length > 0 || fileRejectionItems.length > 0) && <React.Fragment>
                    <div>
                        <h4>Soubory připravené k nahrání</h4>
                        <ul>{files}</ul>
                        <h4>Zamítnuté soubory</h4>
                        <ul>{fileRejectionItems}</ul>
                        {(document.getElementById("messageDiv") && fileRejectionItems.length > 0) ? document.getElementById("messageDiv").remove() : console.log("uh")}
                    </div>
                </React.Fragment>}
                {files.length > 0 && <React.Fragment>
                    <button className={"btn btn-success"} onClick={uploadFiles}>Submit</button>
                </React.Fragment>}

            </section>
        );
    }

    const fileSubmitHandler = (event) => {
        event.preventDefault();
        setFileSize(true);
        if (files.length > 0) {
            setFileUploadProgress(true);
        }
        else {
            return;
        }

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
            headers: { 'content-type': 'application/json' },
            data: data
        };

        axios(config)
            .then(function (response) {
                setMessageColor("green");
                console.log(JSON.stringify(response.data));
                setFileUploadResponse(response.data.message);
                setFileUploadProgress(false);
            })
            .catch(function (error) {
                console.log(error);
                setMessageColor("red");
                setFileUploadResponse(error.response.data.message);
                setFileUploadProgress(false);
            });

    };

    return (

        <div>
            {/* <input type="file" multiple onChange={uploadFileHandler}/> */}
            <Basic />
            <div id="messageDiv">
            {!fileSize && <p style={{ color: 'red' }}>Příliš velký soubor. Limit: 20 MB</p>}
            {fileUploadProgress && <p style={{ color: 'red' }}>Nahrávám soubory...</p>}
            {fileUploadResponse != null && <p style={{ color: messageColor }}>{fileUploadResponse.replace(/[[\]']+/g, '')}</p>}
            </div>
        </div>

    );
}
export default FileManagementComponent;