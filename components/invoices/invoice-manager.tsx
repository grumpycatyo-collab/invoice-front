"use client"
import { useState } from 'react';
import { InvoiceList } from '@/components/invoices/invoice-list';
import InvoiceDetails from '@/components/invoices/invoice-details';

export type Invoice = {
  id: string
  title: string
  description: string
  createdAt: Date
}

const mockInvoices: Invoice[] = [
  { id: '1', createdAt: new Date('2023-05-01'), title: 'Invoice 1', description: 'Description for Invoice 1' },
  { id: '2', createdAt: new Date('2023-05-02'), title: 'Invoice 2', description: 'Description for Invoice 2' },
  { id: '3', createdAt: new Date('2023-05-03'), title: 'Invoice 3', description: 'Description for Invoice 3' },
  { id: '4', createdAt: new Date('2023-05-01'), title: 'Invoice 4', description: 'Description for Invoice 4' },
  { id: '5', createdAt: new Date('2023-05-02'), title: 'Invoice 5', description: 'Description for Invoice 5' },
  { id: '6', createdAt: new Date('2023-05-03'), title: 'Invoice 6', description: 'Description for Invoice 6' },
];

export default function InvoiceManager() {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3">
          <h2 className="text-xl font-semibold">Invoice List</h2>
          <div className="h-[calc(100vh-400px)] overflow-y-auto pr-4">
            <InvoiceList
              invoices={mockInvoices}
            //   onSelectInvoice={setSelectedInvoice}
            />
          </div>
        </div>
        <div className="w-1 bg-gray-200 hidden md:block"></div>
        <div className="w-full md:w-2/3">
          {selectedInvoice ? (
            <InvoiceDetails invoice={selectedInvoice} />
          ) : (
            <p className="text-gray-500">Select an invoice to view details</p>
          )}
        </div>
      </div>
    </div>
  );
}