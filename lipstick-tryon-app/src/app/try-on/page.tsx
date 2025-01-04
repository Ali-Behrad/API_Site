// src/app/try-on/page.tsx
'use client';

// import { userEffect } from "react";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { uploadImage } from '@/lib/api';
import { ProductSelection } from '@/components/ProductSelection';
import { products } from '@/data/products';
import type { Product } from '@/types/product';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  // const [var_that_changes_over_time, setter] = useState(initialValue)
  // This format means the type of the variable must be either String or null with initValue of null
  const [cookie, setCookie] = useState<String | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("Cookie")) {
      alert("No Cookie Found. Redirecting to the main page to use the platform!");

      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    }
    
    else {
      setCookie(localStorage.getItem("Cookie"));
    }
  }, [])


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedProduct) {
      alert('Please select both an image and a lipstick product');
      return;
    }

    setUploading(true);
    try {
      const response = await uploadImage(file, selectedProduct.color_rgb, cookie);
      router.push('/output'); // push to the output
      // window.location.href = "/output"
    } catch (error) {
      console.error('Upload failed', error);
      alert('Failed to process image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Try On Your Perfect Shade
      </h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Your Photo
            </label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-pink-50 file:text-pink-700
                hover:file:bg-pink-100"
            />
          </div>

          <ProductSelection
            products={products}
            selectedProduct={selectedProduct}
            onSelectProduct={setSelectedProduct}
          />

          <button 
            type="submit" 
            disabled={!file || !selectedProduct || uploading}
            className="w-full bg-pink-500 text-white py-3 px-4 rounded-lg 
              hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Processing...' : 'Try On Selected Shade'}
          </button>
        </form>
      </div>
    </div>
  );
}