import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getItemStatus(expiryDate: string | Date) {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry <= 0) {
    return { status: 'expired', color: 'text-red-600', bgColor: 'bg-red-100', badge: 'bg-red-500' };
  } else if (daysUntilExpiry <= 7) {
    return { status: 'expiring-soon', color: 'text-amber-600', bgColor: 'bg-amber-100', badge: 'bg-amber-500' };
  } else {
    return { status: 'safe', color: 'text-green-600', bgColor: 'bg-green-100', badge: 'bg-green-500' };
  }
}

export function formatDaysUntilExpiry(expiryDate: string | Date): string {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry <= 0) {
    const daysExpired = Math.abs(daysUntilExpiry);
    return daysExpired === 0 ? 'Expired today' : `Expired ${daysExpired} day${daysExpired === 1 ? '' : 's'} ago`;
  } else if (daysUntilExpiry === 1) {
    return 'Expires tomorrow';
  } else {
    return `Expires in ${daysUntilExpiry} days`;
  }
}
