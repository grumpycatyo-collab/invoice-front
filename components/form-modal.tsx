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
import { ContractFields } from '@/types/contractFields';
import InvoiceDetailsForm from './invoice-detail-form'
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

export default function InspectModal({ fileId, filePreview, onClose }: InspectModalProps) {
  const [fileDetails, setFileDetails] = useState<ContractFields | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(true);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>();
  const [invoiceId, setInvoiceId] = useState<string>();
 
  const options = {
    cMapUrl: '/cmaps/',
    standardFontDataUrl: '/standard_fonts/',
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = localStorage.getItem('access_token');
  if (accessToken === null){
      localStorage.removeItem('access_token');
  }
  const file_id = String(urlParams.get('fileId'));

  useEffect(() => {
    
    if (file_id) {
      setLoading(true);
      axios.get(`http://localhost:8005/files/inspect_invoice/${file_id}`, {
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
          setFileDetails(response.data.contract_fields);
          setInvoiceId(response.data.invoice_id)
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching file details:', error);
          toast.error('Error fetching file details')
          setLoading(false);
        });
    }
  }, [fileId]);

  const handleCloseModal = () => {
    setShowModal(false);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFileDetails((prev) => prev ? { ...prev, [name]: value } : null);
  };


  const handleSave = async () => {
    if (!fileDetails || !file_id) {
      toast.error('No file details to save');
      return;
    }
  
    try {
      const response = await axios.put(
        `http://localhost:8005/files/save_invoice/${invoiceId}`,
        fileDetails,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers":
              "Access-Control-Allow-Headers, Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization",
          }
        }
      );
  
      if (response.status === 200) {
        toast.success('Invoice saved successfully');
        console.log("Invoice saved:", response.data);
      } else {
        throw new Error('Failed to save invoice');
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
      toast.error('Error saving invoice');
    }
  };

  
  const handleDownload = async () => {
    try {
      const url = `http://localhost:8005/files/download/${file_id}`;
  
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': '*/*',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers":
              "Access-Control-Allow-Headers, Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization",
            'Authorization': `Bearer ${accessToken}`
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Get the filename from the Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition && contentDisposition.match(/filename="?(.+)"?/i);
      const filename = filenameMatch ? filenameMatch[1] : 'download';
  
      // Get the blob from the response
      const blob = await response.blob();
  
      // Create a temporary URL for the blob
      const downloadUrl = window.URL.createObjectURL(blob);
  
      // Create a temporary anchor element and trigger the download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      // Clean up the temporary URL
      window.URL.revokeObjectURL(downloadUrl);
  
      console.log("Document downloaded successfully:", filename);
    } catch (error) {
      console.error("Error downloading document:", error);
    }
  };


  const handleServiceChange = (index: number, field: 'name' | 'price', value: string) => {
    setFileDetails((prev) => {
      if (!prev) return null;
      const updatedServices = prev.services ? [...prev.services] : [];
      updatedServices[index] = { ...updatedServices[index], [field]: field === 'price' ? parseFloat(value) : value };
      return { ...prev, services: updatedServices };
    });
  };

  const addService = () => {
    setFileDetails((prev) => {
      if (!prev) return null;
      const currentServices = prev.services ?? [];
      return { ...prev, services: [...currentServices, { name: '', price: 0 }] };
    });
  };
  
  const removeService = (index: number) => {
    setFileDetails((prev) => {
      if (!prev) return null;
      const currentServices = prev.services ?? [];
      const updatedServices = currentServices.filter((_, i) => i !== index);
      return { ...prev, services: updatedServices };
    });
  };

  if (!fileId) return null;

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
            <h3 className="mb-5 animate-fade-up space-x-2 rounded-full max-w-fit bg-green-100 px-7 py-2 transition-colors hover:bg-green-200 text-md font-sf text-green-600">
  PDF Preview
</h3>
              <div>
                <Document file={filePreview} onLoadSuccess={onDocumentLoadSuccess} className="bg-gray-100 h-[calc(100%-2rem)] flex items-center justify-center rounded-lg border border-gray-200 font-sf">
                  <Page pageNumber={pageNumber} />
                </Document>
              </div>
            </div>

            {/* Invoice Details Form */}
            <div className="w-3/5 h-full overflow-hidden">
              <h3 className="text-md text-gray-900 mb-4 font-sf">Invoice Details</h3>
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <LoadingDots />
                </div>
              ) : (
                <div className="h-[calc(100%-2rem)] overflow-y-auto pr-4">
                  <InvoiceDetailsForm
                    fileDetails={fileDetails}
                    handleInputChange={handleInputChange}
                    handleServiceChange={handleServiceChange}
                    addService={addService}
                    removeService={removeService}
                  />
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