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
  const params = useParams<{ id: string }>()

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="w-full" 
    >
      <Link
        className={cn(
          'inline-flex size-full flex-col space-y-1 rounded-md p-3 text-sm text-muted-foreground transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300 xl:p-2',
          params.id === invoice.id && 'bg-gray-100',
        )}
        href="https://vercel.com/templates/next.js/blob-starter"
        prefetch
      >
        <div className="flex justify-between space-x-2 text-md">
          <span>{formatDate(invoice.createdAt)}</span>
        </div>
        <div>
          <h2 className="line-clamp-2 text-gray-800">{invoice.title}</h2>
          <p className="line-clamp-1 text-gray-600">{invoice.description}</p>
        </div>
      </Link>
    </motion.article>
  )
}