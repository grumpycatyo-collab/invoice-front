'use client'

import { useState, useCallback, useMemo, ChangeEvent } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import LoadingDots from './loading-dots'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface UploaderProps {
  onInspect: (fileId: string) => void;
  onPreview: (preview : string) => void;
}


export default function Uploader({ onInspect, onPreview }: UploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [fileId, setFileId] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isPdf, setIsPdf] = useState(false)

  const resetState = () => {
    setUploadSuccess(false)
    setFileId(null)
  }

  const onChangeFile = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.currentTarget.files && event.currentTarget.files[0]
      if (file) {
        if (file.size / 1024 / 1024 > 50) {
          toast.error('File size too big (max 50MB)')
        } else {
          setFile(file)
          resetState()
          if (file.type === 'application/pdf') {
            setIsPdf(true)
            setPreview(URL.createObjectURL(file))
            onPreview(URL.createObjectURL(file))

          } else if (file.type.includes('word')) {
            setIsPdf(false)
            setPreview('/path-to-your-document-icon.png') // Replace with your document icon path
          } else {
            setIsPdf(false)
            const reader = new FileReader()
            reader.onload = (e) => {
              setPreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)
          }
        }
      }
    },
    [setFile]
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return

    setSaving(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      // Uncomment this when you're ready to make actual API calls
      // const response = await axios.post('http://localhost:8000/upload', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // })
      // const { fileId } = response.data;

      // For now, we'll use a mock fileId
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulating API call
      const mockFileId = 'mock-file-id-' + Date.now()
      
      setFileId(mockFileId)
      setUploadSuccess(true)
      toast.success('File converted successfully!')
      
      // onInspect(mockFileId)
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('Failed to upload file: ' + (error as Error).message)
    } finally {
      setSaving(false)
    }
  }

   const handleInspect = () => {
      if (fileId) {
        onInspect(fileId)
   }
  }

  return (
    <form className="grid gap-6" onSubmit={handleSubmit}>
      <div>
        <div className="space-y-1 mb-4">
          <h2 className="text-xl font-semibold">Upload a file</h2>
          <p className="text-sm text-gray-500">
            Accepted formats: .pdf, .docx, .doc
          </p>
        </div>
        <label
          htmlFor="image-upload"
          className="group relative mt-2 flex h-72 cursor-pointer flex-col items-center justify-center rounded-md border border-gray-300 bg-white shadow-sm transition-all hover:bg-gray-50 overflow-hidden"
        >
          <div
            className="absolute inset-0 z-[5]"
            onDragOver={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDragActive(true)
            }}
            onDragEnter={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDragActive(true)
            }}
            onDragLeave={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDragActive(false)
            }}
            onDrop={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setDragActive(false)

              const file = e.dataTransfer.files && e.dataTransfer.files[0]
              if (file) {
                if (file.size / 1024 / 1024 > 50) {
                  toast.error('File size too big (max 50MB)')
                } else {
                  setFile(file)
                  resetState()
                  if (file.type === 'application/pdf') {
                    setIsPdf(true)
                    setPreview(URL.createObjectURL(file))
                  } else {
                    setIsPdf(false)
                    const reader = new FileReader()
                    reader.onload = (e) => {
                      setPreview(e.target?.result as string)
                    }
                    reader.readAsDataURL(file)
                  }
                }
              }
            }}
          />
          {!preview && (
            <div
              className={`${
                dragActive ? 'border-2 border-black' : ''
              } absolute inset-0 z-[3] flex flex-col items-center justify-center rounded-md px-10 transition-all ${
                file
                  ? 'bg-white/80 opacity-0 hover:opacity-100 hover:backdrop-blur-md'
                  : 'bg-white opacity-100 hover:bg-gray-50'
              }`}
            >
              <svg
                className={`${
                  dragActive ? 'scale-110' : 'scale-100'
                } h-7 w-7 text-gray-500 transition-all duration-75 group-hover:scale-110 group-active:scale-95`}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                <path d="M12 12v9"></path>
                <path d="m16 16-4-4-4 4"></path>
              </svg>
              <p className="mt-2 text-center text-sm text-gray-500">
                Drag and drop or click to upload.
              </p>
              <p className="mt-2 text-center text-sm text-gray-500">
                Max file size: 50MB
              </p>
              <span className="sr-only">File upload</span>
            </div>
          )}
          {preview && (
            <div className="absolute inset-0 z-[2] flex items-center justify-center">
              {isPdf ? (
                <Document file={preview} className="h-full w-full flex items-center justify-center">
                  <Page pageNumber={1} width={300} />
                </Document>
              ) : (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full w-full object-contain"
                />
              )}
            </div>
          )}
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            id="image-upload"
            name="file"
            type="file"
            accept=".pdf,.docx,.doc"
            className="sr-only"
            onChange={onChangeFile}
          />
        </div>
      </div>

      <button
        type={uploadSuccess ? 'button' : 'submit'}
        disabled={!file || saving}
        onClick={uploadSuccess ? handleInspect : undefined}
        className={`${
          !file || saving
            ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
            : 'border-black bg-black text-white hover:bg-white hover:text-black'
        } flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none`}
      >
        {saving ? (
          <LoadingDots color="#808080" />
        ) : (
          <p className="text-sm">
            {uploadSuccess ? 'Inspect' : 'Convert your contract'}
          </p>
        )}
      </button>
    </form>
  )
}