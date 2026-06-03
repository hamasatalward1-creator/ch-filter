import { useState, useEffect } from 'react';

export interface LocalizedString {
  ar: string;
  en: string;
  ur?: string;
  hi?: string;
  bn?: string;
  [key: string]: string | undefined;
}

export interface CatalogProduct {
  id: string;
  partNumber: string;
  buyUrl: string;
  categoryId: string;
  imageUrl?: string;
  name: LocalizedString;
  description: LocalizedString;
}

export function useProducts() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    fetch('/products.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (isMounted) {
          setProducts(data);
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error('Failed to load products:', err);
          setIsLoading(false);
        }
      });
      
    return () => {
      isMounted = false;
    };
  }, []);

  return { products, isLoading };
}
