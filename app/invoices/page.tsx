import { cn } from '@/lib/utils'
import InvoiceManager from '@/components/invoices/invoice-manager';
import { Toaster } from '@/components/toaster'
export default function InvoiceListPage() {
  return (
    
    <div className="p-10 max-w-5xl w-full mt-5">
  <div className="bg-white/30 h-full shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg  w-full">
    <InvoiceManager />
  </div>
  </div>
    
  );
}