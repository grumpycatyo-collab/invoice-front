export interface Service {
  descriptionOfGoodsAndServices?: string;
  quantity: number;
  pricePerUnit: number;
  VAT: number;
  amount: number;
  amountCurrencySymbol: string;
  }
  
  // Define the ContractFields type based on the provided schema
export interface ContractFields {
    id?: number;
    userId?: number;
    logo?: string;
    urlHash?: string;
    docId?: string;
    currencySymbol?: string;
    languageCode?: string;
    issueDate?: string;
    dueDate?: string;
    PONumber?: string;
    fromName?: string;
    fromEmail?: string;
    toName?: string;
    toEmail?: string;
    toPhone?: string;
    toAddress?: string;
    services?: Service[];
    bankDetails?: string;
    additionalInfo?: string;
    companyPromoInfoPhone?: string;
    companyPromoInfoEmail?: string;
    companyPromoInfoWebPage?: string;
    tax?: number;
    discount?: number;
    total?: number;
    subtotal?: number;
    balance_due?: number;
    paidDate?: string;
    paidAmount?: number;
    isRecurring?: boolean;
    totalRecurringDuration?: string;
    paymentFrequency?: string;
  }