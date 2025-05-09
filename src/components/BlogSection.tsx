
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { BookOpen } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
}

const BlogSection = () => {
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "7 Ways to Streamline Your Inventory Management",
      excerpt: "Learn how BillBook can help you optimize your inventory tracking and reduce wastage.",
      date: "May 1, 2025",
      readTime: "5 min read",
      category: "Inventory",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60"
    },
    {
      id: 2,
      title: "Understanding GST Compliance for Small Businesses",
      excerpt: "A comprehensive guide to keeping your business GST compliant with minimal effort.",
      date: "Apr 24, 2025",
      readTime: "7 min read",
      category: "Finance",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60"
    },
    {
      id: 3,
      title: "How to Grow Your Business with Data-Driven Decisions",
      excerpt: "Use BillBook's reporting tools to gain insights and make better business decisions.",
      date: "Apr 15, 2025",
      readTime: "6 min read",
      category: "Analytics",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60"
    }
  ];

  return (
    <section id="blog" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center bg-billbook-100 p-3 rounded-full mb-6">
            <BookOpen size={28} className="text-billbook-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Latest from Our Blog
          </h2>
          <p className="text-lg max-w-3xl mx-auto text-gray-600">
            Insights, tips, and strategies to help you optimize your business operations and boost profitability.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-center mb-2 text-sm text-gray-500">
                  <span className="bg-billbook-50 text-billbook-700 px-2 py-1 rounded-full text-xs">
                    {post.category}
                  </span>
                  <span>{post.date}</span>
                </div>
                <h3 className="font-bold text-xl text-gray-900">{post.title}</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{post.excerpt}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <Button variant="ghost" className="text-billbook-600 hover:bg-billbook-50 p-0">
                  Read More
                </Button>
                <span className="text-sm text-gray-500">{post.readTime}</span>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" className="border-billbook-600 text-billbook-600 hover:bg-billbook-50">
            View All Articles
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
