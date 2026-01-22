'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';

interface SortOption {
  label: string;
  value: string;
  sortBy: string;
  sortOrder: string;
}

const sortOptions: SortOption[] = [
  { label: 'Más recientes', value: 'newest', sortBy: 'createdAt', sortOrder: 'desc' },
  { label: 'Más antiguos', value: 'oldest', sortBy: 'createdAt', sortOrder: 'asc' },
  { label: 'Precio: menor a mayor', value: 'price_asc', sortBy: 'price', sortOrder: 'asc' },
  { label: 'Precio: mayor a menor', value: 'price_desc', sortBy: 'price', sortOrder: 'desc' },
  { label: 'Nombre: A-Z', value: 'name_asc', sortBy: 'name', sortOrder: 'asc' },
  { label: 'Nombre: Z-A', value: 'name_desc', sortBy: 'name', sortOrder: 'desc' },
];

export default function ProductSort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSortBy = searchParams.get('sortBy') || 'createdAt';
  const currentSortOrder = searchParams.get('sortOrder') || 'desc';

  // Find current option
  const currentValue = sortOptions.find(
    (opt) => opt.sortBy === currentSortBy && opt.sortOrder === currentSortOrder
  )?.value || 'newest';

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const selectedOption = sortOptions.find((opt) => opt.value === selectedValue);

    if (!selectedOption) return;

    const params = new URLSearchParams(searchParams.toString());
    
    // Set sort params
    params.set('sortBy', selectedOption.sortBy);
    params.set('sortOrder', selectedOption.sortOrder);
    
    // Reset to page 1 when changing sort
    params.set('page', '1');

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown size={18} className="text-gray-500 dark:text-gray-400 hidden sm:block" />
      <select
        value={currentValue}
        onChange={handleSortChange}
        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
