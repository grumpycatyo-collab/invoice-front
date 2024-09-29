import { Contract } from '@/components/invoices/invoice-manager'
import { InvoiceCard } from './invoice-card'

interface Props {
  invoices: Contract[]
  onSelectInvoice: (invoice: Contract) => void
}

export function InvoiceList({ invoices, onSelectInvoice }: Props) {
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
        <li key={invoice._id} onClick={() => onSelectInvoice(invoice)}>
          <InvoiceCard invoice={invoice} />
        </li>
      ))}
    </ul>
  )
}