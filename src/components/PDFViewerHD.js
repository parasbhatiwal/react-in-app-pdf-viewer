import React, { useRef, useState } from "react";
import * as pdfjsLib from 'pdfjs-dist';
import "@react-pdf-viewer/core/lib/styles/index.css";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/core/lib/styles/index.css';


pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

const PDFViewerHD = () => {

    // creating new plugin instance
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    // pdf file onChange state
    const [pdfFile, setPdfFile] = useState(null);

    // pdf file error state
    const [pdfError, setPdfError] = useState('');


    // handle file onChange event
    const allowedFiles = ['application/pdf'];
    const handleFile = (e) => {
        let selectedFile = e.target.files[0];
        // console.log(selectedFile.type);
        if (selectedFile) {
            if (selectedFile && allowedFiles.includes(selectedFile.type)) {
                let reader = new FileReader();
                reader.readAsDataURL(selectedFile);
                reader.onloadend = (e) => {
                    setPdfError('');
                    setPdfFile(e.target.result);
                }
            }
            else {
                setPdfError('Not a valid pdf: Please select only PDF');
                setPdfFile('');
            }
        }
        else {
            console.log('please select a PDF');
        }
    }

    return (
        <div className="container">

            {/* Upload PDF */}
            <form>

                <label><h5>Upload PDF</h5></label>
                <br></br>

                <input type='file' className="form-control"
                    onChange={handleFile}></input>

                {/* we will display error message in case user select some file
        other than pdf */}
                {pdfError && <span className='text-danger'>{pdfError}</span>}

            </form>

            {/* View PDF */}
            <h5>View PDF</h5>
            <div className="viewer">

                {/* render this if we have a pdf file */}
                {pdfFile && (
                    <Worker workerUrl={pdfjsLib.GlobalWorkerOptions.workerSrc}>
                        <Viewer fileUrl={pdfFile}
                            plugins={[defaultLayoutPluginInstance]}></Viewer>
                    </Worker>
                )}

                {/* render this if we have pdfFile state null   */}
                {!pdfFile && <>No file is selected yet</>}

            </div>

        </div>
    );
};

export default PDFViewerHD;
