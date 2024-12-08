import React, { useRef, useState } from "react";
import * as pdfjsLib from 'pdfjs-dist';
import "@react-pdf-viewer/core/lib/styles/index.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

const PDFViewer = () => {
    const canvasRef = useRef(null);
    const [pdf, setPdf] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                const typedArray = new Uint8Array(fileReader.result);
                loadPdf(typedArray);
            };
            fileReader.readAsArrayBuffer(file);
        }
    };

    const loadPdf = async (pdfData) => {
        try {
            const loadedPdf = await pdfjsLib.getDocument(pdfData).promise;
            setPdf(loadedPdf);
            setPageNumber(1);
            renderPage(loadedPdf, 1);
        } catch (error) {
            console.error("Error loading PDF:", error);
        }
    };

    const renderPage = async (pdf, pageNum) => {
        try {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            };

            await page.render(renderContext).promise;
        } catch (error) {
            console.error("Error rendering page:", error);
        }
    };

    const handlePrevPage = () => {
        if (pageNumber > 1) {
            const newPage = pageNumber - 1;
            setPageNumber(newPage);
            renderPage(pdf, newPage);
        }
    };

    const handleNextPage = () => {
        if (pdf && pageNumber < pdf.numPages) {
            const newPage = pageNumber + 1;
            setPageNumber(newPage);
            renderPage(pdf, newPage);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>PDF Viewer</h1>
            <input
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                style={{ marginBottom: "20px" }}
            />
            <canvas
                ref={canvasRef}
                style={{ border: "1px solid #000", marginBottom: "20px", display: "block" }}
            ></canvas>
            {pdf && (
                <div>
                    <button onClick={handlePrevPage} disabled={pageNumber <= 1}>
                        Previous
                    </button>
                    <button
                        onClick={handleNextPage}
                        disabled={pdf && pageNumber >= pdf.numPages}
                    >
                        Next
                    </button>
                    <p>
                        Page {pageNumber} of {pdf.numPages}
                    </p>
                </div>
            )}
        </div>
    );
};

export default PDFViewer;
