
import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

const ContactSection = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Contact form data:", data);
    // In a real application, you would send this data to your API
    
    // Reset the form
    form.reset();
    
    // Show success message (in a real app, use a toast notification)
    alert("Your message has been sent! We'll get back to you soon.");
  };

  return (
    <section id="contact" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center bg-billbook-100 p-3 rounded-full mb-6">
            <Mail size={28} className="text-billbook-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Get in Touch
          </h2>
          <p className="text-lg max-w-3xl mx-auto text-gray-600">
            Have questions about BillBook? Our team is here to help you find the right solution for your business.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Your email" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Subject of your message" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="How can we help you?" 
                          className="min-h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full bg-billbook-600 hover:bg-billbook-700">
                  Send Message
                </Button>
              </form>
            </Form>
          </div>
          
          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="font-bold text-2xl mb-6 text-gray-900">Contact Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-billbook-100 p-3 rounded-full mr-4">
                  <Phone size={20} className="text-billbook-600" />
                </div>
                <div>
                  <h4 className="font-medium text-lg text-gray-900">Call Us</h4>
                  <p className="text-gray-600">+91 98765 43210</p>
                  <p className="text-gray-500 text-sm">Mon-Fri: 9AM to 6PM</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-billbook-100 p-3 rounded-full mr-4">
                  <Mail size={20} className="text-billbook-600" />
                </div>
                <div>
                  <h4 className="font-medium text-lg text-gray-900">Email Us</h4>
                  <p className="text-gray-600">support@billbook.com</p>
                  <p className="text-gray-500 text-sm">We'll respond within 24 hours</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-billbook-100 p-3 rounded-full mr-4">
                  <MapPin size={20} className="text-billbook-600" />
                </div>
                <div>
                  <h4 className="font-medium text-lg text-gray-900">Visit Us</h4>
                  <p className="text-gray-600">123 Tech Park, Silicon Valley</p>
                  <p className="text-gray-600">Bangalore, Karnataka 560001</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-billbook-100 p-3 rounded-full mr-4">
                  <Clock size={20} className="text-billbook-600" />
                </div>
                <div>
                  <h4 className="font-medium text-lg text-gray-900">Business Hours</h4>
                  <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-gray-600">Saturday - Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
