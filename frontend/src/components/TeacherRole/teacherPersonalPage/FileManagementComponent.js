import React, {useState} from 'react';
import {useDropzone} from 'react-dropzone';
import "./FileManagementComponent.css";
import axios from 'axios'


const FileManagementComponent = ({userDataRef}) => {

    //state for checking file size
    const [fileSize, setFileSize] = useState(true);
    // for file upload progress message
    const [fileUploadProgress, setFileUploadProgress] = useState(false);
    //for displaying response message
    const [fileUploadResponse, setFileUploadResponse] = useState(null);

    const [messageColor, setMessageColor] = useState("green");

    const MAX_FILE_SIZE = 20000000;
    const MAX_NUMBER_OF_FILES = 3;

    const URL = `${process.env.REACT_APP_AXIOS_URL}`;

    const UPLOAD_URL = `${URL}/teacher/upload`;

    //base end point url
    const FILE_UPLOAD_BASE_ENDPOINT = URL;
    const fileTypes = ["JPG", "JPEG", "PNG", "DOCX", "PDF"];

    //https://www.npmjs.com/package/react-drag-drop-files

    function unitConversion(size) {
        let ret;
        ret = size / 1000000 > 1 ? size / 1000000 : size / 1000;
        return Math.round((ret + Number.EPSILON) * 100) / 100

    }

    function fileSizeValidator(file) {
        if (file.size > MAX_FILE_SIZE) {
            return {
                code: "file-too-large",
                message: `Soubor přesahuje maximální povolenou velikost ${MAX_FILE_SIZE / 1000000} MB.`
            };
        }

        return null
    }

    function errorMessage(e) {
        console.log(e.code);
        let message = "Neznámá chyba.";
        if (e.code === "file-too-large") {
            message = e.message;
        } else if (e.code === "file-invalid-type") {
            message = "Nepovolená přípona souboru.";
        } else if (e.code === "too-many-files") {
            message = `Bylo zvoleno příliš mnoho souborů. Maximum je ${MAX_NUMBER_OF_FILES}.`;
        }
        return message;
    }

    function Basic(props) {

        const uploadFiles = () => {
            setFileUploadResponse(null);
            setFileUploadProgress(true);

            let formData = new FormData();

            for (let i = 0; i < acceptedFiles.length; i++) {
                if (acceptedFiles[i].size > MAX_FILE_SIZE) {
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
                url: UPLOAD_URL,
                withCredentials: true,
                headers: {'content-type': 'application/json'},
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
        const {acceptedFiles, getRootProps, fileRejections, getInputProps} = useDropzone({
            accept: 'image/jpeg, image/png, image/png, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/plain, application/pdf',
            onFileDialogOpen: () => {
                if (document.getElementById("messageResponse")) {
                    document.getElementById("messageResponse").textContent = "";

                }

                if (document.getElementById("messageSize")) {
                    document.getElementById("messageSize").textContent = "";
                }

            },
            validator: fileSizeValidator,
            maxFiles: MAX_NUMBER_OF_FILES,

        });


        const files = acceptedFiles.map(file => (
            <p key={file.path}>
                {file.path}
                - {unitConversion(file.size)} {file.size / 1000000 > 1 ? "MB" : "kB"}
            </p>
        ));

        const fileRejectionItems = fileRejections.map(({file, errors}) => (
            <div key={file.path}>
                {file.path}
                - {unitConversion(file.size)} {file.size / 1000000 > 1 ? "MB" : "kB"}
                <div style={{paddingBottom: "15px"}}>
                    {errors.map(e => (
                        <p style={{color: "red", padding: "0", margin: "0", fontSize: "16px"}}
                           key={e.code}>{errorMessage(e)}</p>
                    ))}
                </div>
            </div>
        ));


        return (
            <section className="container">
                <div {...getRootProps({className: 'dropzone'})}>
                    <input {...getInputProps()} />
                    <p>Přetáhnětě soubory zde nebo klikněte a vyberte soubor</p>
                    <p>Povolené přípony: .png, .jpg, .jpeg, .docx, .txt, .pdf</p>
                    <p>Maximum souborů k nahrání: {MAX_NUMBER_OF_FILES}</p>
                    <p>Maximální velikost 1 souboru: {unitConversion(MAX_FILE_SIZE)} MB</p>
                </div>
                {(files.length > 0) && <React.Fragment>
                    <div>
                        <h4 style={{paddingTop: "15px", paddingBottom: "15px"}}>Soubory připravené k nahrání</h4>
                        <div style={{color: "green"}}>{files}</div>
                        <hr/>
                    </div>
                </React.Fragment>}
                {(fileRejectionItems.length > 0) && <React.Fragment>
                    <div>
                        <h4 style={{paddingTop: "15px", paddingBottom: "15px"}}>Zamítnuté soubory</h4>
                        <div>{fileRejectionItems}</div>
                        <hr/>
                    </div>
                </React.Fragment>}
                {files.length > 0 && <React.Fragment>
                    <button className={"btn btn-success"} onClick={() => {
                        uploadFiles();
                        userDataRef()
                    }}>Nahrát
                    </button>
                </React.Fragment>}

            </section>
        );
    }

    return (

        <div>
            {/* <input type="file" multiple onChange={uploadFileHandler}/> */}
            <Basic/>
            <div>
                {!fileSize && <p id="messageSize" style={{color: 'red'}}>Příliš velký soubor. Limit:
                    ${MAX_FILE_SIZE / 1000000} MB</p>}
                {fileUploadProgress && <p style={{color: 'red'}}>Nahrávám soubory...</p>}
                {fileUploadResponse != null &&
                <p id="messageResponse" style={{color: messageColor}}>{fileUploadResponse.replace(/[[\]']+/g, '')}</p>}
            </div>
        </div>

    );
}
export default FileManagementComponent;