// pages/index.js
'use client';

import { useState} from 'react';
import { Product } from '@/types/ProductInterface';
import { ProductSelection } from '@/components/ProductSelection';
import { products } from './data/productsList';
import axios from 'axios';

export default function Home() {
    const [outputImage, setOutputImage] = useState<string | null> (null);
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
          setFile(e.target.files[0]);
        }
      };

    const handleProductSelect = async (product : Product) => {
        console.log('Selected product:', product);

        if(!file) {
            alert("Please upload an image!");
            return;
        }

        try {
            const color = product.color_rgb;
            const url = new URL('/api/upload', window.location.origin);
            url.searchParams.append('color', color);

            const formData = new FormData()
            formData.append("file", file);

            const response = await axios.post(url.toString(), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',

                },
                responseType: 'blob',
            });

            if (!response.data) {
                console.log(response.data.error);
                alert("An error occured");
                return;
            }

            const blobUrl = URL.createObjectURL(response.data);
            setOutputImage(blobUrl);

        } catch (error) {
            console.error('Error uploading file-frontend:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-600 to-white text-white font-sans">
            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center h-screen text-center px-4">
                <h1 className="text-5xl font-bold mb-4">Welcome to The First AI Powered Virtual Try-On Platform!</h1>
                <p className="text-lg mb-8">Revolutionizing the way you interact with your cosmetics.</p>
            </section>

            {/* Upload Section */}
            <section className="py-20 text-purple-900 text-center">
                <h2 className="text-4xl font-bold mb-6">Upload Your Image</h2>
                <div className="border-4 border-dashed border-purple-500 p-10 rounded-lg mx-auto max-w-md">
                    <input
                        type="file"
                        className="hidden"
                        id="fileInput"
                        onChange={handleFileChange}
                    />
                    <label
                        htmlFor="fileInput"
                        className="cursor-pointer text-lg text-purple px-6 py-3 rounded-lg hover:text-pink-700">
                        Drag & drop or click to select files
                    </label>
                </div>
            </section>
            {/* Product Section */}
            <section className="py-20">
                <h3 className="text-3xl font-bold text-center mb-10">Our Products</h3>
                <div className="flex justify-center flex-wrap gap-6">
                    {products.map((product) => (
                        <ProductSelection product={product} onSelectProduct={handleProductSelect} key={product.id}/>
                    ))}
                </div>
            </section>


            {/* Output Section */}
            {outputImage && (
                <div className="mt-10">
                    <h3 className="text-2xl font-semibold mx-auto text-center text-purple-900">Processed Image</h3>
                    <div className="border-4 border-purple-500 rounded-lg overflow-hidden mx-auto max-w-lg">
                        <img
                            src={outputImage}
                            alt="Processed Output"
                            className="w-full h-auto"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
