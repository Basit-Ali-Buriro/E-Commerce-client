import React, { useState, useEffect } from 'react'
import MenHeroSection from '../components/MenHeroSection'
import NewCollections from '../components/NewCollections'
import PageWrapper from '../components/PageWrapper'
import { useProducts } from '../context/ProductContext';

function Men() {
     const { getProductsByCategory, loading, error } = useProducts();
  const [menProducts, setMenProducts] = useState([]);

  useEffect(() => {
    const fetchMenProducts = async () => {
      const products = await getProductsByCategory("men"); // ✅ from context
      setMenProducts(products);
    };
    fetchMenProducts();
  }, [getProductsByCategory]);

  if (loading) return <div className="text-center py-10">Loading products...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div>
      <PageWrapper>
      <MenHeroSection/>
      <NewCollections title={"Mens"} products={menProducts}/>
      </PageWrapper>
    </div>
  )
}

export default Men
