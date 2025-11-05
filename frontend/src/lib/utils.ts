/**
 * Utility functions for Mumbai Civic Budget Portal
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';
import type { ProjectStatus } from '@/types';

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency in Indian Rupees
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return 'N/A';
  
  // Convert to crores if >= 1 crore
  if (amount >= 10000000) {
    const crores = amount / 10000000;
    return `₹${crores.toFixed(2)} Cr`;
  }
  
  // Convert to lakhs if >= 1 lakh
  if (amount >= 100000) {
    const lakhs = amount / 100000;
    return `₹${lakhs.toFixed(2)} L`;
  }
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date to human-readable string
 */
export function formatDate(date: string | Date | null): string {
  if (!date) return 'N/A';
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'MMM dd, yyyy');
}

/**
 * Format date as relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: string | Date | null): string {
  if (!date) return 'Unknown';
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

/**
 * Get status color for badges
 */
export function getStatusColor(status: ProjectStatus): string {
  const colors: Record<ProjectStatus, string> = {
    proposed: 'bg-gray-100 text-gray-800 border-gray-300',
    tendered: 'bg-blue-100 text-blue-800 border-blue-300',
    awarded: 'bg-purple-100 text-purple-800 border-purple-300',
    in_progress: 'bg-amber-100 text-amber-800 border-amber-300',
    completed: 'bg-green-100 text-green-800 border-green-300',
    stalled: 'bg-red-100 text-red-800 border-red-300',
  };
  return colors[status] || colors.proposed;
}

/**
 * Get status label (human-readable)
 */
export function getStatusLabel(status: ProjectStatus): string {
  const labels: Record<ProjectStatus, string> = {
    proposed: 'Proposed',
    tendered: 'Tendered',
    awarded: 'Awarded',
    in_progress: 'In Progress',
    completed: 'Completed',
    stalled: 'Stalled',
  };
  return labels[status] || status;
}

/**
 * Get confidence level from score (0.0 - 1.0)
 */
export function getConfidenceLevel(score: number | null): {
  label: string;
  color: string;
} {
  if (score === null || score === undefined) {
    return { label: 'Unknown', color: 'text-gray-500' };
  }
  
  if (score >= 0.8) return { label: 'High', color: 'text-green-600' };
  if (score >= 0.5) return { label: 'Medium', color: 'text-amber-600' };
  return { label: 'Low', color: 'text-red-600' };
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Download data as JSON file
 */
export function downloadJSON(data: any, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Share URL via Web Share API or copy to clipboard
 */
export async function shareUrl(url: string, title: string): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share({ title, url });
      return true;
    } catch (err) {
      // User cancelled or error occurred
    }
  }
  
  // Fallback to clipboard
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Compress image file before upload
 */
export async function compressImage(file: File, maxWidth = 1200): Promise<File> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: 'image/jpeg' }));
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          0.85
        );
      };
    };
  });
}

/**
 * Mumbai map constants
 */
export const MUMBAI_BOUNDS = {
  north: 19.27,
  south: 18.89,
  east: 72.98,
  west: 72.77,
};

export const MUMBAI_CENTER = {
  lat: parseFloat(process.env.NEXT_PUBLIC_MUMBAI_CENTER_LAT || '19.0760'),
  lng: parseFloat(process.env.NEXT_PUBLIC_MUMBAI_CENTER_LNG || '72.8777'),
};

/**
 * Check if coordinates are within Mumbai bounds
 */
export function isWithinMumbai(lat: number, lng: number): boolean {
  return (
    lat >= MUMBAI_BOUNDS.south &&
    lat <= MUMBAI_BOUNDS.north &&
    lng >= MUMBAI_BOUNDS.west &&
    lng <= MUMBAI_BOUNDS.east
  );
}
