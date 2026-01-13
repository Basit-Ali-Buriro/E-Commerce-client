import React from 'react';
import HeroSection from '../components/HeroSection';
import NewCollections from '../components/NewCollections';
import NewsletterSection from '../components/NewsletterSection';
import PageWrapper from '../components/PageWrapper';
import { useProducts } from '../context/ProductContext'; // ✅ Import your hook

function Home() {
  const { products, loading, error } = useProducts(); // ✅ Get products from context
  
  // console.log(products);
  

  // Show loading and error states
  if (loading) {
    return <div className="text-center py-10">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  // If you want only new collections, you can filter
  const newCollectionProducts = products.slice(0, 4); // Example: first 4 products
  console.log(newCollectionProducts);
  
  return (
    <div>
      <PageWrapper>
        <HeroSection />
        <NewCollections title="NEW COLLECTIONS" products={newCollectionProducts} />
        <NewsletterSection />
      </PageWrapper>
    </div>
  );
}

export default Home;
