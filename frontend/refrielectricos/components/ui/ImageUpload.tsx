'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2} from 'lucide-react';
import Image from 'next/image';
import api from '@/lib/api';
import { useToast } from '@/context/ToastContext';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export default function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      onChange(response.data.url);
      addToast('Imagen subida correctamente', 'success');
    } catch (error) {
      console.error('Error uploading image:', error);
      addToast('Error al subir la imagen', 'error');
    } finally {
      setIsUploading(false);
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center gap-4">
        {value ? (
          <div className="relative w-[200px] h-[200px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="absolute top-2 right-2 z-10">
              <button
                type="button"
                onClick={handleRemove}
                disabled={disabled || isUploading}
                className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors shadow-sm"
              >
                <X size={16} />
              </button>
            </div>
            <Image
              src={value}
              alt="Product Image"
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-[200px] h-[200px] rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all"
          >
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400">
              {isUploading ? <Loader2 className="animate-spin" size={24} /> : <Upload size={24} />}
            </div>
            <div className="text-center px-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isUploading ? 'Subiendo...' : 'Subir imagen'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                JPG, PNG, WEBP
              </p>
            </div>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={disabled || isUploading}
      />
    </div>
  );
}
