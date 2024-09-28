"use client"
import Image from 'next/image'
import Link from 'next/link'
import ExpandingArrow from '@/components/expanding-arrow'
import Uploader from '@/components/uploader'
import { Toaster } from '@/components/toaster'
import InspectModal from '@/components/form-modal'

import { useState } from 'react'
export default function Home() {

  const [inspectFileId, setInspectFileId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleInspect = (fileId: string) => {
    setInspectFileId(fileId)
    setIsModalOpen(true)

  }

  const handleCloseModal = () => {
    setInspectFileId(null)
    setIsModalOpen(false)

  }

  const handlePreview = (preview: string) => {
    setPreview(preview)
  } 
  

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      <Toaster />
      <Link
        href="https://vercel.com/templates/next.js/blob-starter"
        className="group mt-20 sm:mt-0 rounded-full flex space-x-1 bg-white/30 shadow-sm ring-1 ring-gray-900/5 text-gray-600 text-sm font-medium px-10 py-2 hover:shadow-lg active:shadow-sm transition-all"
      >
        <p>See terms and conditions</p>
        <ExpandingArrow />
      </Link>
      <h1 className="pt-4 pb-8 bg-gradient-to-br from-black via-[#171717] to-[#575757] bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
        Invoice your contracts
      </h1>
      <div className="bg-white/30 p-12 shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg max-w-xl mx-auto w-full">
      <Uploader onInspect={handleInspect} onPreview={handlePreview}/>
      </div>
      <p className="font-light text-gray-600 w-full max-w-lg text-center mt-6">
        <Link
          href="https://vercel.com/blob"
          className="font-medium underline underline-offset-4 hover:text-black transition-colors"
        >
          Contract to Invoice Converter
        </Link>{' '}
        demo. Built by{' '}
        <Link
          href="https://nextjs.org/docs"
          className="font-medium underline underline-offset-4 hover:text-black transition-colors"
        >
          Pain Du Chocolat
        </Link>
        .
      </p>
      {/* <div className="sm:absolute sm:bottom-0 w-full px-20 py-10 flex justify-between">
        <Link href="https://vercel.com">
          <Image
            src="/vercel.svg"
            alt="Vercel Logo"
            width={100}
            height={24}
            priority
          />
        </Link>
        <Link
          href="https://github.com/vercel/examples/tree/main/storage/blob-starter"
          className="flex items-center space-x-2"
        >
          <Image
            src="/github.svg"
            alt="GitHub Logo"
            width={24}
            height={24}
            priority
          />
          <p className="font-light">Source</p>
        </Link>
      </div> */}
      {inspectFileId && <InspectModal fileId={inspectFileId} filePreview={preview} onClose={handleCloseModal} />}
    </main>
  )
}
