import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    flagged: 'bg-red-100 text-red-800',
    disputed: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-gray-100 text-gray-800',
    open: 'bg-red-100 text-red-800',
    resolved: 'bg-green-100 text-green-800',
    active: 'bg-green-100 text-green-800',
    canceled: 'bg-gray-100 text-gray-800',
    past_due: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getDiscrepancyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    price_mismatch: 'Price Mismatch',
    item_not_in_contract: 'Item Not in Contract',
    quantity_issue: 'Quantity Issue',
    calculation_error: 'Calculation Error',
    unit_mismatch: 'Unit of Measure Mismatch',
  };
  return labels[type] || type;
}

