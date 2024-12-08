import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import PDFViewerHD from './components/PDFViewerHD';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css'
import PDFViewerTOC from './components/PDFViewerTOC';
// import { GlobalWorkerOptions } from "pdfjs-dist";

// GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/@4.8.69/pdf.worker.min.js`;

ReactDOM.render(
  <React.StrictMode>
    <PDFViewerTOC />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
