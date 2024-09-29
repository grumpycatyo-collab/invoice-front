import { Contract } from '@/components/invoices/invoice-manager';
import { formatDate } from '@/lib/utils';
import LoadingDots from '../loading-dots';
import { useState } from 'react';
import InvoiceDetailsForm from '../invoice-detail-form';
import { ContractFields } from '@/types/contractFields';
interface InvoiceDetailsProps {
  invoice: Contract | null;
  invoiceDetails: ContractFields | null;
  loading: boolean;
}


export default function InvoiceDetails({ invoice, invoiceDetails, loading }: InvoiceDetailsProps) {
    const [fileDetails, setFileDetails] = useState<ContractFields | null>(null);
  
    if (loading) {
    return <div className="justify-content align-center relative flex"><LoadingDots/></div>;
  }

  if (!invoice) {
    return <p className="text-gray-500">Select an invoice to view details</p>;
  }

  if (!invoiceDetails){
    return <div className="text-red-500">Something went wrong. Some of the documents are too old to be parsed.</div>;
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
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
  return (
    <div className="w-full">
     {loading ? (
    <div className="flex items-center justify-center h-full">
      <LoadingDots />
    </div>
  ) : (
    <div className="h-[calc(100%-2rem)] overflow-y-auto pr-4">
      <InvoiceDetailsForm
        fileDetails={invoiceDetails}
        handleInputChange={handleInputChange}
        handleServiceChange={handleServiceChange}
        addService={addService}
        removeService={removeService}
      />
</div>
  )}
    </div>
  );
}