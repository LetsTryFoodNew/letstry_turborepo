import React from 'react';

interface AddToCartButtonProps {
  onClick: () => void;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full  mt-2 mb-2 sm:mt-4 py-1 px-2 sm:px-4  sm:py-2 sm:px-6 border border-[#3f4166] text-[#3f4166] text-sm font-medium rounded hover:bg-[#3f4166] hover:text-white transition-colors duration-200"
    >
      Add to cart
    </button>
  );
};
