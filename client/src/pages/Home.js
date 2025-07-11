import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && user && user.role === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      {/* Featured Products */}
      <FeaturedProducts />
    </div>
  );
};

export default Home; 