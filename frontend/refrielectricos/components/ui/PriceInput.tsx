'use client';

import { forwardRef, ChangeEvent } from 'react';
import { cn } from '@/lib/utils';

interface PriceInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  label?: string;
  error?: string;
  value: number | string;
  onChange: (value: number) => void;
  currencySymbol?: string;
  required?: boolean;
}

/**
 * Format a number with thousands separator
 * e.g., 1234567 -> "1.234.567"
 */
function formatWithThousandsSeparator(num: number | string): string {
  const numValue = typeof num === 'string' ? parseFloat(num) || 0 : num;
  // Use Colombian format (dot as thousands separator)
  return numValue.toLocaleString('es-CO', { maximumFractionDigits: 0 });
}

/**
 * Parse a formatted string back to a number
 * e.g., "1.234.567" -> 1234567
 */
function parseFormattedValue(str: string): number {
  // Remove all non-digit characters except minus sign
  const cleaned = str.replace(/[^\d-]/g, '');
  return parseInt(cleaned, 10) || 0;
}

const PriceInput = forwardRef<HTMLInputElement, PriceInputProps>(
  ({ label, error, className, value, onChange, currencySymbol = '$', disabled, required, ...props }, ref) => {
    const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
    const formattedValue = formatWithThousandsSeparator(numericValue);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      // Allow empty input
      if (inputValue === '') {
        onChange(0);
        return;
      }

      // Parse the input and get numeric value
      const numericValue = parseFormattedValue(inputValue);
      
      // Call onChange with the actual number
      onChange(numericValue);
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium pointer-events-none">
            {currencySymbol}
          </span>
          <input
            ref={ref}
            type="text"
            inputMode="numeric"
            value={formattedValue}
            onChange={handleChange}
            disabled={disabled}
            className={cn(
              "block w-full rounded-md border-0 py-1.5 pl-7 pr-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-600 bg-white dark:bg-gray-800 sm:text-sm sm:leading-6 transition-all",
              error && "ring-red-500 focus:ring-red-500",
              disabled && "bg-gray-100 dark:bg-gray-900 cursor-not-allowed",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

PriceInput.displayName = 'PriceInput';

export default PriceInput;
