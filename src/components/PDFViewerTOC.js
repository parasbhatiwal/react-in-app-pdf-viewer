'use client'

import React, { useState, useRef, useEffect } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import 'pdfjs-dist/web/pdf_viewer.css'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const PDFViewerTOC = () => {
  const [file, setFile] = useState(null)
  const [pdf, setPdf] = useState(null)
  const [pageNum, setPageNum] = useState(1)
  const [numPages, setNumPages] = useState(0)
  const [scale, setScale] = useState(1.0)
  const [toc, setToc] = useState([])
  const canvasRef = useRef(null)

  const loadPDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    setPdf(pdf)
    setNumPages(pdf.numPages)
    generateTableOfContents(pdf)
  }

  const generateTableOfContents = async (pdf) => {
    const tocItems = []
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent();
      console.log(textContent)
      const text = textContent.items.map(item => item.str).join(' ')
      const lines = text.split('\n')
      lines.forEach((line, index) => {
        const lineContent = line.split(" ", 20).join(' ');
        if (lineContent.length > 0) {
          tocItems.push({ title: lineContent.trim(), pageNumber: i })
        }
      })
    }
    setToc(tocItems)
  }

  const renderPage = async () => {
    if (pdf) {
      const page = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale })
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      canvas.height = viewport.height
      canvas.width = viewport.width

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      }
      await page.render(renderContext)
    }
  }

  useEffect(() => {
    renderPage()
  }, [pdf, pageNum, scale])

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      loadPDF(selectedFile)
      setPageNum(1)
    }
  }

  const changePage = (offset) => {
    setPageNum((prevPageNum) => {
      const newPageNum = prevPageNum + offset
      return Math.min(Math.max(1, newPageNum), numPages)
    })
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <div className="w-full md:w-1/4">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="mb-4 p-2 border rounded"
        />
        <h2 className="text-xl font-bold mb-2">Generated Table of Contents</h2>
        <ul className="space-y-1 max-h-96 overflow-y-auto">
          {toc.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => setPageNum(item.pageNumber)}
                className="text-blue-600 hover:underline text-left"
              >
                {item.title} (Page {item.pageNumber})
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full md:w-3/4">
        <div className="border rounded p-4 bg-gray-100">
          <canvas ref={canvasRef} className="mx-auto" />
        </div>
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={() => changePage(-1)}
            disabled={pageNum <= 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Previous
          </button>
          <span>
            Page {pageNum} of {numPages}
          </span>
          <button
            onClick={() => changePage(1)}
            disabled={pageNum >= numPages}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
        <div className="mt-4">
          <label htmlFor="scale" className="mr-2">
            Zoom:
          </label>
          <input
            id="scale"
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="w-48"
          />
          <span className="ml-2">{(scale * 100).toFixed(0)}%</span>
        </div>
      </div>
    </div>
  )
}

export default PDFViewerTOC