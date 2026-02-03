"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { CartService } from "@/lib/cart/cart-service";
import { useCart } from "@/lib/cart/use-cart";

interface Product {
  _id: string;
  name: string;
  slug: string;
  defaultVariant?: {
    discountPercent: number;
    price: number;
    mrp: number;
    thumbnailUrl: string;
    packageSize: string;
  } | null;
}

interface CategoryProductCardProps {
  product: Product;
  categorySlug: string;
}

export const CategoryProductCard: React.FC<CategoryProductCardProps> = ({
  product,
  categorySlug,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const cartQuery = useCart();

  const variant = product.defaultVariant;
  if (!variant) return null;

  const cartItems = cartQuery.data?.myCart?.items || [];
  const quantityInCart =
    cartItems.find((item) => item.productId === product._id)?.quantity || 0;

  const displayImage = variant.thumbnailUrl || "/placeholder-image.svg";

  const handleAddToCart = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await CartService.addToCart(product._id, 1);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Added to cart");
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const handleIncrement = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await CartService.updateCartItem(product._id, quantityInCart + 1);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    } catch (error) {
      toast.error("Failed to update cart");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecrement = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (quantityInCart > 1) {
        await CartService.updateCartItem(product._id, quantityInCart - 1);
      } else {
        await CartService.removeFromCart(product._id);
      }
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    } catch (error) {
      toast.error("Failed to update cart");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article className="flex flex-col border border-gray-200 rounded-2xl bg-white hover:shadow-xl transition-all duration-300 p-2 sm:p-3 h-full">
      <Link href={`/product/${product.slug}`} className="flex flex-col h-full">
        <div className="relative w-full aspect-square mb-3 bg-[#F5F5F5] rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-300">
          <Image
            src={displayImage}
            alt={product.name}
            fill
            className="object-contain p-2 sm:p-4"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          />
        </div>

        <h3 className="text-sm sm:text-base font-bold text-center text-gray-900 line-clamp-2 min-h-[2.5rem] mb-2 px-1">
          {product.name}
        </h3>

        <div className="flex flex-col items-center gap-1 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-bold text-gray-900">
              ₹{variant.price.toFixed(2)}
            </span>
            {variant.mrp && variant.mrp > variant.price && (
              <span className="text-xs sm:text-sm text-gray-400 line-through">
                MRP ₹{variant.mrp.toFixed(2)}
              </span>
            )}
          </div>
          {variant?.discountPercent > 0 && (
            <span className="text-xs sm:text-sm font-bold text-blue-600">
              {variant?.discountPercent}% OFF
            </span>
          )}
        </div>

        <div className="mt-auto">
          <div className="mb-3 px-1">
            <p className="text-[10px] sm:text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Weight</p>
            <div className="relative">
              <div className="w-full h-8 px-3 flex items-center justify-between text-xs font-semibold border border-gray-200 rounded-lg bg-gray-50">
                <span>{variant.packageSize || '200 gm'}</span>
                <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {quantityInCart === 0 ? (
            <button
              className="w-full h-9 sm:h-10 bg-white border border-[#0C5273] text-[#0C5273] text-sm font-bold rounded-lg hover:bg-[#0C5273] hover:text-white transition-all duration-300 disabled:opacity-50"
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart();
              }}
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add to cart"}
            </button>
          ) : (
            <div className="w-full h-9 sm:h-10 flex items-center justify-between border-2 border-brand-hover rounded-lg overflow-hidden bg-white">
              <button
                className="flex-1 h-full bg-[#D1E9F2] text-brand-hover font-extrabold text-xl flex items-center justify-center hover:bg-[#BEE3F0] transition-colors disabled:opacity-50"
                onClick={(e) => {
                  e.preventDefault();
                  handleDecrement();
                }}
                disabled={isLoading}
              >
                −
              </button>
              <span className="flex-1 text-center font-bold text-brand-hover text-sm">
                {isLoading ? "..." : quantityInCart}
              </span>
              <button
                className="flex-1 h-full bg-[#D1E9F2] text-brand-hover font-extrabold text-xl flex items-center justify-center hover:bg-[#BEE3F0] transition-colors disabled:opacity-50"
                onClick={(e) => {
                  e.preventDefault();
                  handleIncrement();
                }}
                disabled={isLoading}
              >
                +
              </button>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
};
