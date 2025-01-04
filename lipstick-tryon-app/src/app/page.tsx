"use client";

import { useEffect } from 'react';
import axios from 'axios';
import Link from "next/link";

export default function Landing() {
    useEffect(() => {
      const fetchCookie = async () => {
        try {
            if(!localStorage.getItem("Cookie")){
              const response = await axios.get('/api/set-cookie', {
                  withCredentials: true, 
              });
              localStorage.setItem("Cookie", response.data.cookie);
            }
            else {
              console.log("Existing Cookie Found: ", localStorage.getItem("Cookie"));
            }
        } catch (error) {
            console.error('Error fetching cookie:', error);
        }
      };
      
      fetchCookie();
    }, [])

    return (
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6 text-pink-600">
          Welcome to Stellens Virtual Try-On Platform
        </h1>
        <div className="max-w-2xl mx-auto space-y-4">
          <p>
            Discover the perfect lipstick shade without leaving your home! 
            Our AI-powered platform allows you to virtually try on different 
            lipstick colors instantly.
          </p>
          <p>
            Simply upload a photo of yourself, and our advanced machine 
            learning model will help you find your ideal lip color.
          </p>
          <div className='text-center'>
            <Link href="/try-on">
                <button className='pink-600' style={{ 

                    backgroundColor: '#DB2777', 
                    color: 'white', 
                    padding: '10px 20px', 
                    border: 'none', 
                    borderRadius: '5px', 
                    cursor: 'pointer', 
                    fontSize: '16px' 
                }}>
                    Try-On Now
                </button>
            </Link>
        </div>
        </div>
      </div>
    );
  }