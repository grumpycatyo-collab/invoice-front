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
          // console.log(response.data)
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


  const handleSave = () => {
    console.log("Saving document:", fileDetails);
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

  const fieldMapping: { [key: string]: string } = {
    currencySymbol: "Currency",
    issueDate: "Issue Date",
    dueDate: "Due Date",
    PONumber: "PO Number",
    fromName: "From Name",
    fromEmail: "From Email",
    toName: "To Name",
    toEmail: "To Email",
    toPhone: "To Phone",
    toAddress: "To Address",
    companyPromoInfoPhone: "Company Phone",
    companyPromoInfoEmail: "Company Email",
    companyPromoInfoWebPage: "Company Website",
    tax: "Tax",
    discount: "Discount",
    total: "Total",
    subtotal: "Subtotal",
    balance_due: "Balance Due",
    paidDate: "Paid Date",
    paidAmount: "Paid Amount",
    totalRecurringDuration: "Recurring Duration",
    paymentFrequency: "Payment Frequency"
  };

  const excludedFields = ['id', 'userId', 'logo', 'urlHash', 'docId', 'isRecurring', 'languageCode'];

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
                                value={value?.toString() || ''}
                                onChange={handleInputChange}
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <div className="mt-6">
  <h4 className="text-lg font-medium text-gray-900 mb-2">Services</h4>
  <div className="bg-gray-50 p-4 rounded-md border border-gray-200 space-y-3">
    {fileDetails?.services?.map((service, index) => (
      <div key={index} className="flex items-center space-x-2">
        <input
          type="text"
          value={service.name}
          onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Service name"
        />
        <input
          type="number"
          value={service.price}
          onChange={(e) => handleServiceChange(index, 'price', e.target.value)}
          className="w-32 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Price"
        />
        <button
          type="button"
          onClick={() => removeService(index)}
          className="p-2 hover:text-red-700 transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <button
      type="button"
      onClick={addService}
      className="p-2 transition-colors duration-200"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
      </svg>
    </button>
      </div>
    ))}
    
  </div>
</div>

            {/* Bank Details */}
            <div className="mt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-2">Bank Details</h4>
              <textarea
                name="bankDetails"
                value={fileDetails?.bankDetails || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows={4}
              />
            </div>

            {/* Additional Info */}
            <div className="mt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-2">Additional Information</h4>
              <textarea
                name="additionalInfo"
                value={fileDetails?.additionalInfo || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows={4}
              />
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