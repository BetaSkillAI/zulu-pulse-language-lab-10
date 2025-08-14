import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  // SEO setup
  document.title = "Contact Us - Get in Touch | Learn Zulu";
  document.querySelector('meta[name="description"]')?.setAttribute('content', 
    'Have questions about learning Zulu? Contact Learn Zulu for support, partnership opportunities, or community involvement. We\'re here to help with your Zulu learning journey.');
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', 'Contact Us - Get in Touch | Learn Zulu');
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', 
    'Contact Learn Zulu for support and questions about learning the Zulu language.');
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', '/contact');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: "hello@learnzulu.com",
      description: "Send us an email and we'll respond within 24 hours"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "+27 82 556 6633",
      description: "Monday to Friday, 9AM - 5PM SAST"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: "Johannesburg, South Africa",
      description: "Come visit our offices in the heart of Johannesburg"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Contact Learn Zulu
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions about learning Zulu? Want to contribute to our platform? 
            We'd love to hear from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <Card className="shadow-warm mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <info.icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{info.title}</h3>
                      <p className="text-primary font-medium">{info.details}</p>
                      <p className="text-sm text-muted-foreground">{info.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gradient-primary text-primary-foreground shadow-warm">
              <CardHeader>
                <CardTitle>Join Our Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Connect with other Zulu learners and native speakers in our community forums.
                </p>
                <Button variant="secondary" className="w-full">
                  Join Community
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-warm">
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Your full name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your.email@example.com"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="What is this about?"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Tell us more about your message..."
                      rows={6}
                      className="mt-1"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:shadow-warm transition-all">
              <CardHeader>
                <CardTitle className="text-lg">Is Learn Zulu suitable for complete beginners?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Absolutely! Our courses start from the very basics and gradually build up your knowledge. 
                  No prior knowledge of Zulu is required.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-warm transition-all">
              <CardHeader>
                <CardTitle className="text-lg">How long does it take to learn Zulu?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Learning time varies by individual, but with consistent practice (15-30 minutes daily), 
                  you can have basic conversations within 3-6 months.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-warm transition-all">
              <CardHeader>
                <CardTitle className="text-lg">Can I practice with native speakers?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! We have a community feature where you can connect with native Zulu speakers 
                  and other learners for practice sessions.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-warm transition-all">
              <CardHeader>
                <CardTitle className="text-lg">Is the content culturally authentic?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  All our content is created and reviewed by native Zulu speakers and cultural experts 
                  to ensure accuracy and cultural sensitivity.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;