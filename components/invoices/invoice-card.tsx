'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'

import { cn, formatDate } from '@/lib/utils'

import type { InvoiceResource } from '@/types/invoiceType'

interface Props {
  invoice: InvoiceResource
}

export function InvoiceCard({ invoice }: Props) {
  const params = useParams<{ id: string }>();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.03, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
      whileTap={{ scale: 0.98 }}
      className="w-full"
    >
      <Link
        className={cn(
          'inline-flex w-full flex-col space-y-3 rounded-lg p-4 text-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          params.id === invoice.id ? 'bg-blue-50 border-2 border-blue-200' : 'bg-white border border-gray-200',
        )}
        href="https://vercel.com/templates/next.js/blob-starter"
        prefetch
      >
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {formatDate(invoice.createdAt)}
          </span>
          <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
            ${32}
          </span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">{invoice.title}</h2>
          <p className="text-sm text-gray-600 line-clamp-2">{invoice.description}</p>
        </div>
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Invoice #{invoice.id.slice(0, 8)}</span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Due in {4} days
          </span>
        </div>
      </Link>
    </motion.article>
  );
}