
import React, { useState, useEffect } from 'react';
import { Users, Building, FileText, Clock } from 'lucide-react';

interface StatItem {
  icon: React.ElementType;
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
}

const StatCounter = ({ 
  endValue, 
  duration = 2000, 
  prefix = "", 
  suffix = ""
}: { 
  endValue: number; 
  duration?: number; 
  prefix?: string; 
  suffix?: string;
}) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    
    // Animation function
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * endValue));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    // Start animation only if in viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animationFrame = requestAnimationFrame(animate);
          observer.disconnect();
        }
      });
    }, { threshold: 0.1 });
    
    // Create a temporary div to observe (we're in a functional component)
    const tempDiv = document.createElement('div');
    document.body.appendChild(tempDiv);
    observer.observe(tempDiv);
    
    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      document.body.removeChild(tempDiv);
    };
  }, [endValue, duration]);
  
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

const StatsSection = () => {
  const stats: StatItem[] = [
    {
      icon: Users,
      value: 10000,
      label: "Active Users",
      suffix: "+"
    },
    {
      icon: FileText,
      value: 5000000,
      label: "Invoices Generated",
      suffix: "+"
    },
    {
      icon: Building,
      value: 25,
      label: "Industries Served"
    },
    {
      icon: Clock,
      value: 100000,
      label: "Hours Saved Monthly",
      suffix: "+"
    }
  ];
  
  return (
    <section id="stats" className="py-16 bg-gradient-to-r from-billbook-600 to-billbook-500 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            BillBook by the Numbers
          </h2>
          <p className="text-lg max-w-3xl mx-auto opacity-90">
            Trusted by businesses across India to simplify their financial operations.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center bg-white/10 p-4 rounded-full mb-4">
                <stat.icon size={32} className="text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-2">
                <StatCounter 
                  endValue={stat.value} 
                  prefix={stat.prefix || ""} 
                  suffix={stat.suffix || ""} 
                />
              </div>
              <p className="text-white/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
