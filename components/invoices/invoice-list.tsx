import type { InvoiceResource } from '@/types/invoiceType'

import { InvoiceCard } from './invoice-card'

interface Props {
    invoices: InvoiceResource[]
}

export function InvoiceList({ invoices }: Props) {
  if (!invoices.length) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <span>No resources found.</span>
      </div>
    )
  }

  return (
    <ul className="space-y-1 py-2 xl:py-4">
      {invoices.map((invoice) => (
        <li key={invoice.id}>
          <InvoiceCard invoice={invoice} />
        </li>
      ))}
    </ul>
  )
}