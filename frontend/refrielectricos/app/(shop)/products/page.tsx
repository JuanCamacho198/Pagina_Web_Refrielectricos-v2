'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import ProductCard from '@/components/features/products/ProductCard';
import ProductFilters from '@/components/features/products/ProductFilters';
import Button from '@/components/ui/Button';
import { Search, Filter } from 'lucide-react';
import { Product } from '@/types/product';

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);

  // Inicializar búsqueda desde URL
  useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      setSearchTerm(search);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Lógica de filtrado
  useEffect(() => {
    let result = products;

    // Filtro por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.brand?.toLowerCase().includes(term) ||
        p.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Filtro por categoría
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filtro por marca
    if (selectedBrand) {
      result = result.filter(p => p.brand === selectedBrand);
    }

    // Filtro por precio
    if (priceRange.min) {
      result = result.filter(p => p.price >= Number(priceRange.min));
    }
    if (priceRange.max) {
      result = result.filter(p => p.price <= Number(priceRange.max));
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, selectedBrand, priceRange, products]);

  // Obtener categorías y marcas únicas
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean))) as string[];
  const brands = Array.from(new Set(products.map(p => p.brand).filter(Boolean))) as string[];

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedBrand(null);
    setPriceRange({ min: '', max: '' });
  };

  const handlePriceRangeChange = (type: 'min' | 'max', value: string) => {
    setPriceRange(prev => ({ ...prev, [type]: value }));
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Catálogo de Productos</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Explora nuestra variedad de repuestos y equipos.</p>
        </div>
        
        <div className="w-full md:w-auto flex gap-2">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Buscar productos..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            className="md:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} />
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar de Filtros */}
        <aside className={`lg:w-64 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <ProductFilters
            categories={categories}
            brands={brands}
            selectedCategory={selectedCategory}
            selectedBrand={selectedBrand}
            priceRange={priceRange}
            onCategoryChange={setSelectedCategory}
            onBrandChange={setSelectedBrand}
            onPriceRangeChange={handlePriceRangeChange}
            onClearFilters={clearFilters}
          />
        </aside>

        {/* Grid de Productos */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 border-dashed transition-colors">
              <Search className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No se encontraron productos</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Intenta con otros términos de búsqueda o filtros.</p>
              <div className="mt-6">
                <Button onClick={clearFilters} variant="outline">
                  Limpiar filtros
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Cargando catálogo...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
