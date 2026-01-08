import React from 'react';

interface CategoryHeaderProps {
  title: string;
  productCount: number;
}

export const CategoryHeader: React.FC<CategoryHeaderProps> = ({ title, productCount }) => {
  return (
    <div className="mb-4 sm:mb-6 md:mb-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-1 sm:mb-2">{title}</h1>
      <p className="text-gray-600 text-sm sm:text-base md:text-lg">{productCount} products</p>
    </div>
  );
};
