
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      
      <footer className="py-12 px-4 border-t">
        <div className="container mx-auto text-center">
          <p className="text-sm text-foreground/60">
            © {new Date().getFullYear()} Opus Crafter. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
