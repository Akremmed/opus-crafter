
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Play, ArrowRight, Scissors, Video } from "lucide-react";

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      
      containerRef.current.style.setProperty('--mouse-x', `${x}`);
      containerRef.current.style.setProperty('--mouse-y', `${y}`);
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center justify-center px-4 overflow-hidden"
      style={{
        '--mouse-x': '0.5',
        '--mouse-y': '0.5',
      } as React.CSSProperties}
    >
      {/* Background gradient that follows mouse */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none animated-gradient"
        style={{
          backgroundPosition: 'calc(var(--mouse-x) * 100%) calc(var(--mouse-y) * 100%)',
        }}
      />
      
      {/* Decorative elements */}
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-2s' }} />
      
      <div className="container mx-auto text-center relative z-10">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary mb-8 animate-fade-in">
          <span className="text-xs font-medium">Professional Video Editing Made Simple</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-semibold mb-6 tracking-tight animate-slide-up">
          Craft Stunning Videos <br className="hidden md:block" />
          with Elegance
        </h1>
        
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-foreground/80 mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
          Create professional-quality videos with an intuitive, minimalist editor designed for creators who value simplicity and powerful results.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <Button asChild size="lg" className="rounded-full px-8 h-12">
            <Link to="/editor">
              <Play className="mr-2 h-5 w-5" />
              Start Editing
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-12">
            <Link to="/#features">
              Explore Features
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Preview card */}
      <div className="absolute bottom-[-100px] left-1/2 transform -translate-x-1/2 w-full max-w-5xl">
        <div className="glass-card p-4 animate-float" style={{ animationDelay: '-3s' }}>
          <div className="aspect-video rounded-lg bg-muted overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <Video className="h-16 w-16 text-primary/40" />
                <p className="mt-4 text-foreground/50 text-sm">Upload a video to start editing</p>
              </div>
            </div>
            
            {/* Mock timeline */}
            <div className="absolute bottom-4 left-4 right-4 h-16 glass rounded-lg flex items-center px-4">
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary/50 w-3/4 rounded-full"></div>
              </div>
              <div className="ml-4 h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Play className="h-4 w-4 text-primary" />
              </div>
            </div>
            
            {/* Mock toolbar */}
            <div className="absolute top-4 right-4 flex gap-2">
              <div className="h-8 w-8 glass rounded-full flex items-center justify-center">
                <Scissors className="h-4 w-4" />
              </div>
              <div className="h-8 w-8 glass rounded-full flex items-center justify-center">
                <Video className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
