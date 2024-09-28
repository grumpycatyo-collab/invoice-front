'use client'

import { useState, useCallback, useMemo, ChangeEvent } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import LoadingDots from './loading-dots'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

// Make sure to set the worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface UploaderProps {
  onInspect: (fileId: string) => void;
}

export default function Uploader({ onInspect }: UploaderProps) {
  
  const [data, setData] = useState<{
    image: string | null
  }>({
    image: null,
  })
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [fileId, setFileId] = useState<string | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null)
  const [isPdf, setIsPdf] = useState(false)


  const onChangeFile = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.currentTarget.files && event.currentTarget.files[0]
      if (file) {
        if (file.size / 1024 / 1024 > 50) {
          toast.error('File size too big (max 50MB)')
        } else {
          setFile(file)
          if (file.type === 'application/pdf') {
            setIsPdf(true)
            setPreview(URL.createObjectURL(file))
            console.log(URL.createObjectURL(file))
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

  const saveDisabled = useMemo(() => {
    return !data.image || saving
  }, [data.image, saving])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)

    const formData = new FormData()
    if (file) {
      formData.append('file', file)
      console.log('File name:', file.name)
      console.log('File type:', file.type)
      console.log('File size:', file.size, 'bytes')
    }

    try {
      // const response = await axios.post('http://localhost:8000/upload', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // })


      setTimeout(() => {
        const mockFileId = 'mock-file-id-' + Date.now()
        setSaving(false)
        setUploadSuccess(true)
        setFileId(mockFileId)
      }, 2000)

      toast(
        (t: { id: string } 
          ) => (
          <div className="relative">
            <div className="p-2">
              <p className="font-semibold text-gray-900">
                File uploaded!
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Your file has been uploaded
              </p>
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="absolute top-0 -right-2 inline-flex text-gray-400 focus:outline-none focus:text-gray-500 rounded-full p-1.5 hover:bg-gray-100 transition ease-in-out duration-150"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 5.293a1 1 0 011.414 0L10
                    8.586l3.293-3.293a1 1 0 111.414 1.414L11.414
                    10l3.293 3.293a1 1 0 01-1.414 1.414L10
                    11.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586
                    10 5.293 6.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ),
        { duration: 2000 }
      )
      setUploadSuccess(true)
      // Handle successful upload (e.g., display the uploaded file URL)
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('Failed to upload file: ' + (error as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const handleInspect = () => {
    if (fileId) {
      setIsModalOpen(true);
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
                  if (file.type === 'application/pdf') {
                    setIsPdf(true)
                    setPreview(URL.createObjectURL(file))
                  } else {
                    setIsPdf(false)
                    const reader = new FileReader()
                    reader.onload = (e) => {
                      setPreview(e.target?.result as string)
                      setData({ image: e.target?.result as string })
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
                data.image
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
          <p className="text-sm">{uploadSuccess ? 'Inspect' : 'Convert your contract'}</p>
        )}
      </button>
    </form>
  )
}