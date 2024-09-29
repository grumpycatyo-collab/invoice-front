import { cn } from '@/lib/utils'
import InvoiceManager from '@/components/invoices/invoice-manager';
import { Toaster } from '@/components/toaster'
import Link from 'next/link'
import ExpandingArrow from '@/components/expanding-arrow'
export default function InvoiceListPage() {
  return (
    // <main className=" min-h-screen flex-col items-center justify-center">
    <div className="relative flex-col flex max-w-5xl w-full ">
     <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 pb-4 sm:space-x-4">
<Link
        href="/invoices"
        className="group rounded-full  flex space-x-1 bg-white/30 shadow-sm ring-1 ring-gray-900/5 text-gray-600 text-sm font-medium px-10 py-2 hover:shadow-lg active:shadow-sm transition-all"
      >
        <p>See other invoices</p>
        <ExpandingArrow />
      </Link>

      <a
      href="https://twitter.com/steventey/status/1613928948915920896"
      target="_blank"
      rel="noreferrer"
      className="mx-auto mb-5 flex max-w-fit animate-fade-up items-center justify-center space-x-2 overflow-hidden rounded-full bg-purple-100 px-7 py-2 transition-colors hover:bg-purple-200"
    >
      <p className="text-sm font-semibold text-purple-600">
        Dashboard 
      </p>
</a>
  </div> 

  <div className="bg-white/30 h-full shadow-xl ring-1 ring-gray-900/5 rounded-lg backdrop-blur-lg  w-full">
    <InvoiceManager />
  </div>
  </div>
  // </main>
  );
}