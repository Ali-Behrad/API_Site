'use client';

import { Product } from "@/types/ProductInterface";
import Image from 'next/image';

interface ProductSelectionProps {
    product: Product;
    onSelectProduct: (product: Product) => void;  
}

export function ProductSelection({product, onSelectProduct}: ProductSelectionProps) {
    return (
        <div className="p-4 rounded-lg shadow-md text-center w-[250px]">
            <Image
                src={product.imageUrl}
                alt={product.name}
                width={"250"}
                height={"250"}
                className="object-cover"
            />
            <h4 className="text-xl font-semibold mb-1">
                <button
                    onClick={() => onSelectProduct(product)}
                    className="text-purple-600 hover:underline cursor-pointer"
                >
                    {product.name}
                </button>
            </h4>
            <p className="text-gray-700">Color: {product.color}</p>
        </div>
    )
}