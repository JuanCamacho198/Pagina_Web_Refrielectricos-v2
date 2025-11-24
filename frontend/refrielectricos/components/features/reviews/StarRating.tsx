'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: number;
}

export function StarRating({ value, onChange, readOnly = false, size = 20 }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const displayValue = hoverValue ?? value;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (readOnly || !onChange) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isHalf = x < rect.width / 2;
    
    setHoverValue(index + (isHalf ? 0.5 : 1));
  };

  const handleClick = () => {
    if (readOnly || !onChange || hoverValue === null) return;
    onChange(hoverValue);
  };

  return (
    <div className="flex items-center gap-0.5" onMouseLeave={() => setHoverValue(null)}>
      {[0, 1, 2, 3, 4].map((index) => {
        const filled = displayValue >= index + 1;
        const halfFilled = displayValue >= index + 0.5 && displayValue < index + 1;

        return (
          <div
            key={index}
            className={cn(
              "relative cursor-pointer transition-transform hover:scale-110",
              readOnly && "cursor-default hover:scale-100"
            )}
            style={{ width: size, height: size }}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onClick={handleClick}
          >
            {/* Empty Star Background */}
            <Star 
              size={size} 
              className="text-gray-300 absolute top-0 left-0" 
              strokeWidth={1.5}
            />
            
            {/* Filled Star */}
            {filled && (
              <Star 
                size={size} 
                className="text-yellow-400 fill-yellow-400 absolute top-0 left-0" 
                strokeWidth={1.5}
              />
            )}

            {/* Half Filled Star */}
            {halfFilled && (
              <div className="absolute top-0 left-0 overflow-hidden" style={{ width: '50%' }}>
                 <Star 
                  size={size} 
                  className="text-yellow-400 fill-yellow-400" 
                  strokeWidth={1.5}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
