// src/lib/api.ts

import axios from 'axios';

export async function uploadImage(file: File, color: string, cookie: String | null) {
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('color', color);
    formData.append("cookie", `${cookie}`)

    // Send the formData with the cookie
    const response = await axios.post("/api/upload", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, // Important to send cookies
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
    }
}

export async function getOutputImage(cookie: String | null): Promise<Blob> {
  try {
    // Make a GET request to the Flask API
    const response = await axios.get("/api/output", {
      params:{
        cookie: cookie
      },
        responseType: 'blob', 
        withCredentials: true,
    });

    return response.data; // Return the image blob
} catch (error) {
    console.error('Error retrieving output image:', error);
    throw error;
  }
}