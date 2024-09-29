import { Invoice } from '@/components/invoices/invoice-manager';

interface InvoiceDetailsProps {
  invoice: Invoice | null;
}

export default function InvoiceDetails({ invoice }: InvoiceDetailsProps) {
  return (
    <div className="w-2/3 pl-4 border-l">
      <h2 className="text-xl font-semibold mb-2">Invoice Details</h2>
      {invoice ? (
        <div>
          <p><strong>Name:</strong> {invoice.title}</p>
          <p><strong>Date:</strong> {"FSDF"}</p>
          <p><strong>Description:</strong> {invoice.description}</p>
        </div>
      ) : (
        <p>No invoice selected</p>
      )}
    </div>
  );
}