// src/app/output/page.tsx
'use client'; // render client side

import { useState, useEffect } from 'react';
import { getOutputImage } from '@/lib/api';

export default function OutputPage() {
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cookie, setCookie] = useState<String | null>(localStorage.getItem("Cookie") || null);

  useEffect(() => {
    if (!localStorage.getItem("Cookie")) {
      alert("No Cookie Found. Redirecting to the main page to use the platform!");

      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    }
    
    else {
      setCookie(cookie);
    }
  })

  useEffect(() => {
    async function fetchOutputImage() {
      try {
        const imageBlob = await getOutputImage(cookie);
        const imageUrl = URL.createObjectURL(imageBlob);
        setOutputImage(imageUrl);
      } catch (err: any) {
        if (err.status === 403) {
          setError('No image available. Please upload a photo first.');
        } else {
          setError(err.message);
        }
      }
    }

    fetchOutputImage();
  }, []);

  if (error) {
    return (
      <div className="text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-6">
        Your Lipstick Try-On Result
      </h1>
      {outputImage && (
        <img 
          src={outputImage} 
          alt="Lipstick Try-On Result" 
          className="max-w-full mx-auto rounded-lg shadow-lg"
        />
      )}
    </div>
  );
}