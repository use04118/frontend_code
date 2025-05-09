
import React, { useEffect, useState } from 'react';
import { CircleDashed } from 'lucide-react';

const Preloader = () => {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 200);

    // Simulate loading time or wait for resources
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setLoading(false);
      }, 600); // Slightly longer for smoother transition
    }, 1500);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, []);

  if (!loading) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-white transition-all duration-700 ${
        fadeOut ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
      }`}
    >
      <div className="flex flex-col items-center">
        <div className="relative w-16 h-16 mb-4">
          <CircleDashed size={64} className="text-billbook-200 absolute inset-0" />
          <CircleDashed 
            size={64} 
            className="text-billbook-600 animate-spin absolute inset-0" 
            style={{ animationDuration: '3s' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-medium text-billbook-700">{Math.round(progress)}%</span>
          </div>
        </div>
        <div className="mt-4 text-xl font-bold text-billbook-700 animate-pulse">
          <span className="inline-block mr-1">Bill</span>
          <span className="inline-block text-billbook-500">Book</span>
        </div>
        <div className="mt-2 text-gray-600">Loading your experience...</div>
        <div className="mt-6 w-48 bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-billbook-600 h-1.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
