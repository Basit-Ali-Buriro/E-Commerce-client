import React, { useState, useEffect } from 'react'
import KidsHeroSection from '../components/KidsHeroSection'
import NewCollections from '../components/NewCollections'
import PageWrapper from '../components/PageWrapper'
import { useProducts } from '../context/ProductContext';

function Kids() {
 const { getProductsByCategory, loading, error } = useProducts();
     const [kidsProducts, setMenProducts] = useState([]);
   
     useEffect(() => {
       const fetchMenProducts = async () => {
         const products = await getProductsByCategory("kids"); // ✅ from context
         setMenProducts(products);
       };
       fetchMenProducts();
     }, [getProductsByCategory]);
   
     if (loading) return <div className="text-center py-10">Loading products...</div>;
     if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div>
      <PageWrapper>

      <KidsHeroSection/>
      <NewCollections title={"Kids"} products={kidsProducts}/>
      </PageWrapper>
    </div>
  )
}

export default Kids
