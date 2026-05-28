/**
 * モック融資DB（勘定系DBのイメージ）
 * CIF番号・口座番号・取引先名で検索し、フォームに自動入力する
 */

import { DealInput } from "@/types/deal";

export interface LoanRecord {
  cifNo: string;
  loanAccountNo: string;
  transactionNo: string;
  branchCode: string;
  branchName: string;
  customerName: string;
  input: Omit<DealInput, "prepayment" | "remarks">;
}

export const BRANCH_MAP: Record<string, string> = {
  "100": "東京営業部",
  "101": "丸の内支店",
  "102": "新宿支店",
  "200": "横浜支店",
  "201": "川崎支店",
  "300": "大阪支店",
  "301": "梅田支店",
  "400": "名古屋支店",
  "500": "福岡支店",
};

export const MOCK_LOAN_DB: LoanRecord[] = [
  {
    cifNo: "1234567890",
    loanAccountNo: "987654321",
    transactionNo: "1000000",
    branchCode: "200",
    branchName: "横浜支店",
    customerName: "株式会社てすと",
    input: {
      customerInfo: {
        customerName: "株式会社てすと",
        branchCode: "200",
        cifNo: "1234567890",
        loanAccountNo: "987654321",
        transactionNo: "1000000",
      },
      originalContract: {
        borrowingDate: "2024-06-05",
        maturityDate: "2029-06-30",
        nextPaymentDate: "2026-07-05",
        fixedEndDate: "2029-06-30",
        executionAmount: 31800000,
        contractRate: 1.52091,
        repaymentMethod: "EQUAL_PRINCIPAL",
        productType: "CORPORATE",
        interestType: "FIXED",
      },
      schedule: {
        interestReceiveType: "POST",
        paymentInterval: "1M",
        holidayAdjustment: "FOLLOWING",
        contractDate: "2024-06-05",
      },
      rateInfo: {
        internalRate: 0.55,
        customerRate: 1.52091,
        spread: 0.97091,
      },
    },
  },
  {
    cifNo: "9876543210",
    loanAccountNo: "123456789",
    transactionNo: "1000001",
    branchCode: "200",
    branchName: "横浜支店",
    customerName: "田中建設株式会社",
    input: {
      customerInfo: {
        customerName: "田中建設株式会社",
        branchCode: "200",
        cifNo: "9876543210",
        loanAccountNo: "123456789",
        transactionNo: "1000001",
      },
      originalContract: {
        borrowingDate: "2022-04-01",
        maturityDate: "2027-03-31",
        nextPaymentDate: "2026-06-30",
        fixedEndDate: "2027-03-31",
        executionAmount: 50000000,
        contractRate: 1.85000,
        repaymentMethod: "EQUAL_PAYMENT",
        productType: "CORPORATE",
        interestType: "FIXED",
      },
      schedule: {
        interestReceiveType: "POST",
        paymentInterval: "3M",
        holidayAdjustment: "FOLLOWING",
        contractDate: "2022-04-01",
      },
      rateInfo: {
        internalRate: 0.75,
        customerRate: 1.85000,
        spread: 1.10000,
      },
    },
  },
  {
    cifNo: "5555000111",
    loanAccountNo: "444333222",
    transactionNo: "1000002",
    branchCode: "100",
    branchName: "東京営業部",
    customerName: "山本商事株式会社",
    input: {
      customerInfo: {
        customerName: "山本商事株式会社",
        branchCode: "100",
        cifNo: "5555000111",
        loanAccountNo: "444333222",
        transactionNo: "1000002",
      },
      originalContract: {
        borrowingDate: "2023-01-10",
        maturityDate: "2028-01-10",
        nextPaymentDate: "2026-07-10",
        fixedEndDate: "2028-01-10",
        executionAmount: 80000000,
        contractRate: 1.42000,
        repaymentMethod: "BULLET",
        productType: "CORPORATE",
        interestType: "FIXED",
      },
      schedule: {
        interestReceiveType: "POST",
        paymentInterval: "6M",
        holidayAdjustment: "FOLLOWING",
        contractDate: "2023-01-10",
      },
      rateInfo: {
        internalRate: 0.48,
        customerRate: 1.42000,
        spread: 0.94000,
      },
    },
  },
  {
    cifNo: "3333444555",
    loanAccountNo: "777888999",
    transactionNo: "1000003",
    branchCode: "300",
    branchName: "大阪支店",
    customerName: "大阪製造株式会社",
    input: {
      customerInfo: {
        customerName: "大阪製造株式会社",
        branchCode: "300",
        cifNo: "3333444555",
        loanAccountNo: "777888999",
        transactionNo: "1000003",
      },
      originalContract: {
        borrowingDate: "2021-07-01",
        maturityDate: "2026-06-30",
        nextPaymentDate: "2026-06-30",
        fixedEndDate: "2026-06-30",
        executionAmount: 120000000,
        contractRate: 1.65000,
        repaymentMethod: "EQUAL_PRINCIPAL",
        productType: "CORPORATE",
        interestType: "FIXED",
      },
      schedule: {
        interestReceiveType: "POST",
        paymentInterval: "3M",
        holidayAdjustment: "PRECEDING",
        contractDate: "2021-07-01",
      },
      rateInfo: {
        internalRate: 0.62,
        customerRate: 1.65000,
        spread: 1.03000,
      },
    },
  },
  {
    cifNo: "1111222333",
    loanAccountNo: "555666777",
    transactionNo: "1000004",
    branchCode: "400",
    branchName: "名古屋支店",
    customerName: "東京物産株式会社",
    input: {
      customerInfo: {
        customerName: "東京物産株式会社",
        branchCode: "400",
        cifNo: "1111222333",
        loanAccountNo: "555666777",
        transactionNo: "1000004",
      },
      originalContract: {
        borrowingDate: "2023-10-01",
        maturityDate: "2030-09-30",
        nextPaymentDate: "2026-10-01",
        fixedEndDate: "2030-09-30",
        executionAmount: 200000000,
        contractRate: 1.35000,
        repaymentMethod: "EQUAL_PAYMENT",
        productType: "CORPORATE",
        interestType: "FIXED",
      },
      schedule: {
        interestReceiveType: "POST",
        paymentInterval: "6M",
        holidayAdjustment: "FOLLOWING",
        contractDate: "2023-10-01",
      },
      rateInfo: {
        internalRate: 0.42,
        customerRate: 1.35000,
        spread: 0.93000,
      },
    },
  },
];

export function searchLoanDb(query: string): LoanRecord | null {
  const q = query.trim();
  if (!q) return null;
  return (
    MOCK_LOAN_DB.find(
      (r) =>
        r.cifNo === q ||
        r.loanAccountNo === q ||
        r.customerName.includes(q)
    ) ?? null
  );
}
