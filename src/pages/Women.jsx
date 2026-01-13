import React, {useState, useEffect} from 'react'
import WomenHeroSection from '../components/WomenHeroSection'
import NewCollections from '../components/NewCollections';
import PageWrapper from '../components/PageWrapper';
import { useProducts } from '../context/ProductContext';

function Women() {
   const { getProductsByCategory, loading, error } = useProducts();
    const [womenProducts, setMenProducts] = useState([]);
  
    useEffect(() => {
      const fetchMenProducts = async () => {
        const products = await getProductsByCategory("women"); // ✅ from context
        setMenProducts(products);
      };
      fetchMenProducts();
    }, [getProductsByCategory]);
  
    if (loading) return <div className="text-center py-10">Loading products...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div>
      <PageWrapper>
      <WomenHeroSection/>
      <NewCollections title={"Women"} products={womenProducts}/>
      </PageWrapper>
    </div>
  )
}

export default Women
