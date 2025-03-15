
import React from 'react';
import { Scissors, Video, Upload, Clock, Volume2, Layout } from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <div className="glass-card p-6 transition-all duration-300 hover:shadow-xl">
      <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4 text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-foreground/70">{description}</p>
    </div>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: <Scissors className="h-6 w-6" />,
      title: "Precise Cutting",
      description: "Trim and split videos with frame-perfect accuracy using our intuitive timeline editor."
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "HD Export",
      description: "Export your videos in high-definition quality with custom resolution settings."
    },
    {
      icon: <Upload className="h-6 w-6" />,
      title: "Easy Uploads",
      description: "Import videos from your device with a simple drag-and-drop interface."
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Time Control",
      description: "Adjust playback speed, create slow-motion or time-lapse effects with precision."
    },
    {
      icon: <Volume2 className="h-6 w-6" />,
      title: "Audio Editing",
      description: "Fine-tune audio levels and add background music to enhance your videos."
    },
    {
      icon: <Layout className="h-6 w-6" />,
      title: "Intuitive Interface",
      description: "Navigate our minimal, clean interface designed to keep focus on your content."
    }
  ];

  return (
    <section id="features" className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary mb-4">
            <span className="text-xs font-medium">Powerful Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4">Everything You Need</h2>
          <p className="max-w-2xl mx-auto text-foreground/70">
            Our video editor combines powerful features with simplicity, giving you all the tools you need to create stunning videos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="transform transition-all duration-500 hover:-translate-y-1" style={{ animationDelay: `${index * 100}ms` }}>
              <Feature
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Background elements */}
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
    </section>
  );
};

export default Features;
