// src/components/ProductSelection.tsx
import { Product } from '@/types/product';
import Image from 'next/image';

interface ProductSelectionProps {
  products: Product[];
  selectedProduct: Product | null;
  onSelectProduct: (product: Product) => void;
}

export function ProductSelection({ 
  products, 
  selectedProduct, 
  onSelectProduct 
}: ProductSelectionProps) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Select a Lipstick</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedProduct?.id === product.id
                ? 'border-pink-500 shadow-lg'
                : 'border-gray-200 hover:border-pink-300'
            }`}
            onClick={() => onSelectProduct(product)}
          >
            <div className="relative aspect-square mb-4">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-8 h-8 rounded-full border border-gray-200"
                style={{ backgroundColor: product.color_rgb }}
                title={`Color: ${product.color_rgb}`}
              />
              <h3 className="font-semibold">{product.name}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">{product.description}</p>
            <p className="text-pink-600 font-bold">
              ${product.price.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}