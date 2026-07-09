export interface TransactionTypeItem {
  id: string;
  titleEn: string;
  titleHi: string;
  descriptionEn: string;
  /** Path to the illustration in /public. */
  icon: string;
  /** Route to open when this transaction type is implemented. */
  href?: string;
}

const FALLBACK_ICON = "/Ellipse 58 (4).png";

/** Reusable list of transaction types shown on the Transaction Master landing page. */
export const TRANSACTION_TYPES: TransactionTypeItem[] = [
  {
    id: "cash-deposit",
    titleEn: "Cash Deposit",
    titleHi: "रोख रक्कम जमा",
    descriptionEn: "Enter the cash deposit transaction details.",
    icon: "/cash deposite.png",
  },
  {
    id: "cash-withdrawal",
    titleEn: "Cash Withdrawal",
    titleHi: "रोख रक्कम काढणे",
    descriptionEn: "Enter the cash Withdrawal transaction details.",
    icon: "/Cash Withdrawal.png",
  },
  {
    id: "rtgs",
    titleEn: "RTGS",
    titleHi: "रोख रक्कम काढणे",
    descriptionEn: "Enter the RTGS transaction details.",
    icon: "/RTGS.png",
  },
  {
    id: "tds-transaction",
    titleEn: "TDS Transaction",
    titleHi: "टीडीएस व्यवहार",
    descriptionEn: "Enter the TDS transaction details.",
    icon: FALLBACK_ICON,
  },
  {
    id: "td-interest-payment",
    titleEn: "TD Interest Payment",
    titleHi: "रोख रक्कम काढणे",
    descriptionEn: "Enter the TD Interest Payment transaction details.",
    icon: "/TD Intrest Payment.png",
  },
  {
    id: "recurring-installment",
    titleEn: "Recurring Installment",
    titleHi: "रोख रक्कम काढणे",
    descriptionEn: "Enter the Recurring Installment transaction details.",
    icon: FALLBACK_ICON,
  },
  {
    id: "tl-cc-installment",
    titleEn: "TL/CC Installment",
    titleHi: "रोख रक्कम काढणे",
    descriptionEn: "Enter the TL/CC Installment transaction details.",
    icon: FALLBACK_ICON,
  },
  {
    id: "tl-disbursement",
    titleEn: "TL Disbursement",
    titleHi: "रोख रक्कम काढणे",
    descriptionEn: "Enter the RTGS transaction details.",
    icon: FALLBACK_ICON,
    href: "/transactionmaster/tl-disbursement",
  },
  {
    id: "tl-other-charges",
    titleEn: "TL Other Charges",
    titleHi: "रोख रक्कम काढणे",
    descriptionEn: "Enter the TL Other Charges transaction details.",
    icon: FALLBACK_ICON,
  },
  {
    id: "transfer",
    titleEn: "Transfer",
    titleHi: "रोख रक्कम काढणे",
    descriptionEn: "Enter the Transfer transaction details.",
    icon: "/Transfer.png",
  },
];
