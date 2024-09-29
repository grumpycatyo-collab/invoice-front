// InvoiceDetailsForm.tsx
import React from 'react';
import { ContractFields, Service } from '@/types/contractFields';

interface InvoiceDetailsFormProps {
  fileDetails: ContractFields | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void;
  handleServiceChange: (
    index: number, 
    field: keyof Service, 
    value: string | number
  ) => void;
  addService: () => void;
  removeService: (index: number) => void;
}

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

export default function InvoiceDetailsForm({
  fileDetails,
  handleInputChange,
  handleCheckboxChange,
  handleServiceChange,
  addService,
  removeService
}: InvoiceDetailsFormProps) {
  console.log(fileDetails)
  return (
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
                  type={key === 'issueDate' || key === 'dueDate' || key === 'paidDate' ? 'date' : 'text'}
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
                value={service.descriptionOfGoodsAndServices}
                onChange={(e) => handleServiceChange(index, 'descriptionOfGoodsAndServices', e.target.value)}
                className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Description of goods and services"
              />
              <input
                type="number"
                value={service.quantity}
                onChange={(e) => handleServiceChange(index, 'quantity', e.target.value)}
                className="w-24 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Quantity"
              />
              <input
                type="number"
                value={service.pricePerUnit}
                onChange={(e) => handleServiceChange(index, 'pricePerUnit', e.target.value)}
                className="w-32 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Price per unit"
              />
              <input
                type="number"
                value={service.VAT}
                onChange={(e) => handleServiceChange(index, 'VAT', e.target.value)}
                className="w-24 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="VAT"
              />
              <input
                type="number"
                value={service.amount}
                onChange={(e) => handleServiceChange(index, 'amount', e.target.value)}
                className="w-32 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Amount"
              />
              <input
                type="text"
                value={service.amountCurrencySymbol}
                onChange={(e) => handleServiceChange(index, 'amountCurrencySymbol', e.target.value)}
                className="w-16 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Currency"
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
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addService}
          className="mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Service
        </button>
      </div>
      <div className="col-span-2 flex items-center">
          <input
            type="checkbox"
            id="is_expenses"
            name="is_expenses"
            checked={fileDetails?.is_expenses || false}
            onChange={(e) => handleCheckboxChange('is_expenses', e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="is_expenses" className="ml-2 block text-sm text-gray-900">
            Is Expenses
          </label>
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
  );
}