import { useStoreSettings } from '@/hooks/useStoreSettings';
import { formatPrice, formatPriceSimple } from '@/lib/formatters';

interface PriceProps {
  amount: number;
  simple?: boolean;
  className?: string;
}

/**
 * Price component that automatically formats prices using the store's currency setting
 * 
 * @example
 * <Price amount={150000} /> // Displays: $150.000 (COP format)
 * <Price amount={150000} simple /> // Displays: 150.000 (no currency symbol)
 */
export function Price({ amount, simple = false, className = '' }: PriceProps) {
  const { settings } = useStoreSettings();
  const currency = settings.currency || 'COP';
  
  const formatted = simple 
    ? formatPriceSimple(amount, currency)
    : formatPrice(amount, currency);

  return <span className={className}>{formatted}</span>;
}

/**
 * Hook to get price formatter function with current currency
 * 
 * @example
 * const formatPrice = usePriceFormatter();
 * const price = formatPrice(150000); // "$150.000"
 */
export function usePriceFormatter() {
  const { settings } = useStoreSettings();
  const currency = settings.currency || 'COP';

  return (amount: number, simple: boolean = false) => {
    return simple 
      ? formatPriceSimple(amount, currency)
      : formatPrice(amount, currency);
  };
}
