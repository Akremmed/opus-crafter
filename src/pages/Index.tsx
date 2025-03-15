
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import { YoutubeIcon, Upload, Scissors, PlaySquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      
      {/* New YouTube Feature Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="glass-card p-8 rounded-xl overflow-hidden relative">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
            
            <div className="max-w-3xl mx-auto text-center relative z-10">
              <YoutubeIcon className="h-16 w-16 text-red-500 mx-auto mb-6" />
              <h2 className="text-3xl font-display font-medium mb-4">
                Create Shorts from YouTube Videos
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Paste any YouTube URL and our AI will automatically extract the most interesting parts,
                add subtitles, and create engaging shorts ready to share.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm">Import YouTube Video</p>
                </div>
                
                <div className="hidden sm:block text-3xl">→</div>
                
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Scissors className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm">Auto-Extract Best Parts</p>
                </div>
                
                <div className="hidden sm:block text-3xl">→</div>
                
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <PlaySquare className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm">Export Polished Shorts</p>
                </div>
              </div>
              
              <Link to="/editor">
                <Button size="lg" className="animate-pulse">
                  <YoutubeIcon className="mr-2 h-4 w-4" />
                  Try YouTube Import Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
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
