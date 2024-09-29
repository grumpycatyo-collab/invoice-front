"use client"
import { useState, useEffect } from 'react';
import { InvoiceList } from '@/components/invoices/invoice-list';
import InvoiceDetails from '@/components/invoices/invoice-details';
import LoadingDots from '../loading-dots';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ContractFields } from '@/types/contractFields';
import Tooltip from "../shared/tooltip";
export interface Contract {
  _id: string;
  contract_fields: {
    issueDate: string;
    fromName: string;
  };
  filename: string;
  user_id: string;
  documentId: string;
}

export default function InvoiceManager() {
  const [invoices, setInvoices] = useState<Contract[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [invoiceDetails, setInvoiceDetails] = useState<ContractFields | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken === null) {
          localStorage.removeItem('access_token');
          return;
        }
        const response = await fetch('http://localhost:8005/files/get_invoices/', {
          headers: {
            'Content-Type': 'multipart/form-data',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers":
              "Access-Control-Allow-Headers, Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization",
            'Authorization': `Bearer ${accessToken}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch invoices');
        }
        const data = await response.json();
        console.log(data)
        setInvoices(data);
        setIsLoading(false);
      } catch (err) {
        setError('Error fetching invoices. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, []);
  const accessToken = localStorage.getItem('access_token');
      
  if (accessToken === null) {
    localStorage.removeItem('access_token');
    return;
  }
  useEffect(() => {
    if (selectedInvoice) {
      setLoading(true);
     
      axios.get(`http://localhost:8005/files/inspect_invoice/${selectedInvoice.documentId}`, {
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
          setInvoiceDetails(response.data.contract_fields);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching invoice details:', error);

          if (error.response && error.response.status === 400) {
            toast.error('The document might be too old');
            setInvoiceDetails(null);
          } else {
            toast.error('Error fetching invoice details');
          }
          setLoading(false);
        });
    }
  }, [selectedInvoice]);

  const handleSelectInvoice = (invoice: Contract) => {
    setSelectedInvoice(invoice);
    setInvoiceDetails(null);
  };

  if (isLoading) {
    return <LoadingDots />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleSave = async () => {
   
    if (selectedInvoice) {
    try {
      const response = await axios.put(
        `http://localhost:8005/files/save_invoice/${selectedInvoice.documentId}`,
        invoiceDetails,
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
}
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3">
          <h2 className="text-xl font-sf ">Invoice List</h2>
          <div className="h-[calc(100vh-100px)] overflow-y-auto pr-4">
            <InvoiceList
              invoices={invoices}
              onSelectInvoice={handleSelectInvoice}
            />
          </div>
        </div>
        <div className="w-1 bg-gray-200 hidden md:block"></div>
        <div className="w-full h-[calc(100vh-100px)]md:w-2/3">
          {selectedInvoice ? (
            <InvoiceDetails 
              invoice={selectedInvoice} 
              invoiceDetails={invoiceDetails}
              loading={loading}
            />
          ) : (
            <p className="text-gray-500">Select an invoice to view details</p>
          )}
        </div>
      </div>
      <div className="px-6 py-3 flex justify-end space-x-2">
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
            // onClick={handleDownload}
            className="font-sf flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white text-black hover:bg-gray-100 text-sm transition-all focus:outline-none px-4"
          >
            Download
          </button>
        </div>
    </div>
  );
}