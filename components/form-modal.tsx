"use client";
import axios from 'axios';

import { Dispatch, SetStateAction,useCallback} from "react";
import { cn } from "@/lib/utils";
import { Drawer } from "vaul";
import * as Dialog from "@radix-ui/react-dialog";
import useMediaQuery from "@/lib/hooks/use-media-query";
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import toast from 'react-hot-toast'
export function Modal({
  children,
  className,
  showModal,
  setShowModal,
}: {
  children: React.ReactNode;
  className?: string;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { isMobile } = useMediaQuery();

  
  if (isMobile) {
    return (
      <Drawer.Root open={showModal} onOpenChange={setShowModal}>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-gray-100 bg-opacity-10 backdrop-blur" />
        <Drawer.Portal>
          <Drawer.Content
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50 mt-24 rounded-t-[10px] border-t border-gray-200 bg-white",
              className,
            )}
          >
            <div className="sticky top-0 z-20 flex w-full items-center justify-center rounded-t-[10px] bg-inherit">
              <div className="my-3 h-1 w-12 rounded-full bg-gray-300" />
            </div>
            {children}
          </Drawer.Content>
          <Drawer.Overlay />
        </Drawer.Portal>
      </Drawer.Root>
    );
  }
  return (
    <Dialog.Root open={showModal} onOpenChange={setShowModal}>
      <Dialog.Portal>
        <Dialog.Overlay
          id="modal-backdrop"
          className="animate-fade-in fixed inset-0 z-40 bg-gray-100 bg-opacity-50 backdrop-blur-md"
        />
        <Dialog.Content
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className={cn(
            "animate-scale-in fixed inset-0 z-40 m-auto max-h-[90vh] w-full max-w-[90vw] overflow-hidden border border-gray-200 bg-white p-0 shadow-xl md:rounded-2xl",
            className,
          )}
        >
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}


import { useState, useEffect } from 'react';
import LoadingDots from '@/components/shared/icons/loading-dots';
import Tooltip from "./shared/tooltip";

interface InspectModalProps {
  fileId: string | null;
  filePreview: string | null;
  onClose: () => void;
}

interface FileDetails {
  [key: string]: string | number | boolean;
}

export default function InspectModal({ fileId, filePreview, onClose }: InspectModalProps) {
  const [fileDetails, setFileDetails] = useState<FileDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(true);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>();
 
  const options = {
    cMapUrl: '/cmaps/',
    standardFontDataUrl: '/standard_fonts/',
  };
  type PDFFile = string | File | null;

  

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = localStorage.getItem('access_token');
    if (accessToken === null){
        localStorage.removeItem('access_token');
    }
    const file_id = String(urlParams.get('fileId'));
    if (file_id) {
      setLoading(true);
      axios.get(`http://localhost:8005/files/inspect_invoice/${file_id}`,{
        headers: {
          'Content-Type': 'multipart/form-data',
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers":
            "Access-Control-Allow-Headers, Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization",
          'Authorization': `Bearer ${accessToken}`
        }
      })
        .then(response => {
          setFileDetails(response.data);
          console.log(response.data)
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching file details:', error);
          toast.error('')
          setLoading(false);

        });
    }
  }, [fileId]);

  const handleCloseModal = () => {
    setShowModal(false);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFileDetails((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleSave = () => {
    console.log("Saving document:", fileDetails);
  };

  const handleDownload = () => {
    console.log("Downloading document:", fileDetails);
  };

  if (!fileId) return null;

  const fieldMapping: { [key: string]: string } = {
    docId: "Invoice Number",
    issueDate: "Issue Date",
    dueDate: "Due Date",
    PONumber: "PO Number",
    fromName: "From",
    toName: "Bill To",
    toAddress: "Address",
    toPhone: "Phone",
    toEmail: "Email",
    subtotal: "Subtotal",
    tax: "Tax",
    discount: "Discount",
    total: "Total",
    balance_due: "Balance Due"
  };

  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <div className="flex flex-col h-full relative">
      <button
          onClick={handleCloseModal}
          className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex-grow overflow-hidden pt-6 pl-6 pr-6 pb-0">
          <div className="flex h-full gap-6">
            {/* PDF Preview */}
            <div className="w-2/5 h-full overflow-hidden">
              <h3 className="text-xl text-gray-900 mb-4 font-sf">PDF Preview</h3>
              <div >
              <Document file={filePreview} onLoadSuccess={onDocumentLoadSuccess} className="bg-gray-100 h-[calc(100%-2rem)] flex items-center justify-center rounded-lg border border-gray-200 font-sf" >
                
              <Page pageNumber={pageNumber} />

                </Document> 

              
              </div>

              
            </div>

            {/* Invoice Details Form */}
            <div className="w-3/5 h-full overflow-hidden">
              <h3 className="text-xl  text-gray-900 mb-4 font-sf">Invoice Details</h3>
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <LoadingDots />
                </div>
              ) : (
                <div className="h-[calc(100%-2rem)] overflow-y-auto pr-4">
                  <form className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      {fileDetails && Object.entries(fileDetails).map(([key, value]) => {
                        if (fieldMapping[key]) {
                          return (
                            <div key={key} className="flex flex-col">
                              <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">
                                {fieldMapping[key]}
                              </label>
                              <input
                                type="text"
                                name={key}
                                id={key}
                                value={value.toString()}
                                onChange={handleInputChange}
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>

                    {/* Services Section */}
                    <div className="mt-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Services</h4>
                      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                        {fileDetails && JSON.parse(fileDetails.services as string).map((service: any, index: number) => (
                          <div key={index} className="flex justify-between items-center mb-2">
                            <span>{service.name}</span>
                            <span>${service.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bank Details */}
                    <div className="mt-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Bank Details</h4>
                      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                        <p>{fileDetails?.bankDetails}</p>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Additional Information</h4>
                      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                        <p>{fileDetails?.additionalInfo}</p>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-2">
        <Tooltip content="Saves invoice to your library">
          <button
            type="button"
            onClick={handleSave}
            className="font-sf flex h-10 items-center justify-center rounded-md border border-black bg-black text-white hover:bg-white hover:text-black text-sm transition-all focus:outline-none px-4"
          >
            Save
          </button>
          </Tooltip>
          <button
            type="button"
            onClick={handleDownload}
            className="font-sf flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white text-black hover:bg-gray-100 text-sm transition-all focus:outline-none px-4"
          >
            Download
          </button>
        </div>
      </div>
    </Modal>
  );
}