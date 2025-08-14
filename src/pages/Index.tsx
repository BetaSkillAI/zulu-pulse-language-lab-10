
import { Link } from "react-router-dom";
import { BookOpen, Music, Mic, Users, Play, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import heroImage from "../assets/hero-image.jpg";

const Index = () => {
  // SEO meta data - will be handled by document head
  const pageTitle = "Learn Zulu - Interactive Zulu Language Learning Platform";
  const pageDescription = "Learn Zulu through interactive lessons, traditional music, and cultural experiences. Start your Zulu language journey with structured courses, voice practice, and authentic content.";
  
  // Set document title
  document.title = pageTitle;
  const features = [
    {
      icon: BookOpen,
      title: "Structured Courses",
      description: "Progressive lessons from beginner to advanced levels"
    },
    {
      icon: Music,
      title: "Cultural Music",
      description: "Learn through traditional Zulu songs and lyrics"
    },
    {
      icon: Mic,
      title: "Voice Practice",
      description: "Record and compare your pronunciation"
    },
    {
      icon: Users,
      title: "Community",
      description: "Connect with native speakers and fellow learners"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Active Learners" },
    { number: "500+", label: "Lessons Available" },
    { number: "50+", label: "Traditional Songs" },
    { number: "4.9/5", label: "User Rating" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Animated Background */}
      <section className="relative bg-gradient-animated text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary-glow/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-accent/20 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-primary/30 rounded-full animate-float"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-right">
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-bounce-in text-white drop-shadow-lg">
                Learn Zulu with
                <span className="block text-primary-glow glow-primary drop-shadow-lg">Heart & Soul</span>
              </h1>
              <p className="text-xl mb-8 text-white/95 leading-relaxed animate-slide-up drop-shadow-md">
                Discover the beautiful Zulu language through interactive lessons, 
                traditional music, and authentic cultural experiences. 
                Start your journey today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up">
                <Link to="/courses">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/95 shadow-warm hover-lift hover-glow font-semibold">
                    <Play className="h-5 w-5 mr-2" />
                    Start Learning Free
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="border-white/80 bg-white/10 text-white hover:bg-white/20 hover-lift backdrop-blur-sm">
                    Have Questions?
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative animate-slide-left">
              <img 
                src={heroImage} 
                alt="Learn Zulu - Interactive language learning with cultural experiences" 
                className="rounded-lg shadow-warm w-full h-auto hover-lift"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Staggered Animation */}
      <section className="py-16 bg-gradient-secondary border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 animate-stagger-children">
            {stats.map((stat, index) => (
              <div key={index} className="text-center hover-lift">
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2 glow-primary">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with Modern Glassmorphism Design */}
      <section className="py-20 bg-gradient-to-br from-background via-card/50 to-background relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-gradient-to-l from-accent/30 to-primary/30 rounded-full blur-3xl animate-pulse opacity-20 animate-[pulse_3s_ease-in-out_infinite_1s]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-5xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Why Choose Learn Zulu?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Experience the most comprehensive and culturally authentic Zulu learning platform designed for modern learners
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group relative animate-fade-in hover-scale"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Glassmorphism Card */}
                <div className="relative bg-gradient-to-br from-card/80 via-card/60 to-card/40 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/30 hover:-translate-y-2">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Icon Container with Advanced Animation */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary via-primary-glow to-accent rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl shadow-primary/30">
                      <feature.icon className="h-10 w-10 text-primary-foreground drop-shadow-lg" />
                    </div>
                    {/* Floating Ring Animation */}
                    <div className="absolute inset-0 w-20 h-20 mx-auto border-2 border-primary/30 rounded-2xl animate-pulse opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700"></div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
                    {feature.description}
                  </p>
                  
                  {/* Animated Border */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"></div>
                </div>
                
                {/* Interactive Particles */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-accent rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-500"></div>
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-700"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Path Section with Animated Background */}
      <section className="py-20 bg-gradient-animated relative">
        <div className="absolute inset-0 bg-background/90"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-right">
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Your Zulu Learning Journey
              </h2>
              <div className="space-y-6 animate-stagger-children">
                <div className="flex items-start space-x-4 hover-lift">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center glow-primary">
                    <CheckCircle className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Start with Basics</h3>
                    <p className="text-muted-foreground">Learn essential greetings, family terms, and everyday expressions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 hover-lift">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center glow-primary">
                    <CheckCircle className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Practice Speaking</h3>
                    <p className="text-muted-foreground">Use our voice recognition to perfect your pronunciation</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 hover-lift">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center glow-primary">
                    <CheckCircle className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Immerse in Culture</h3>
                    <p className="text-muted-foreground">Learn through traditional songs and cultural stories</p>
                  </div>
                </div>
              </div>
              <Link to="/courses" className="inline-block mt-8">
                <Button size="lg" className="bg-gradient-primary hover-lift hover-glow">
                  Start Your Journey
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 animate-slide-left">
              <Card className="hover-lift hover-glow transition-all bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Beginner</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">8 lessons • 45 minutes</p>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-current text-accent mr-1" />
                    <span className="text-sm">Perfect for beginners</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover-lift hover-glow transition-all bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Intermediate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">15 lessons • 2 hours</p>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-current text-primary mr-1" />
                    <span className="text-sm">Build confidence</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover-lift hover-glow transition-all bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Advanced</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">25 lessons • 4 hours</p>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-current text-destructive mr-1" />
                    <span className="text-sm">Master the language</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover-lift hover-glow transition-all bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Cultural</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">50+ songs • Ongoing</p>
                  <div className="flex items-center">
                    <Music className="h-4 w-4 text-accent mr-1" />
                    <span className="text-sm">Songs & stories</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Enhanced Gradient */}
      <section className="py-20 bg-gradient-animated text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-20 w-24 h-24 bg-primary-glow/20 rounded-full animate-float"></div>
        <div className="absolute bottom-10 right-20 w-32 h-32 bg-accent/20 rounded-full animate-float-delayed"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6 animate-bounce-in text-white drop-shadow-lg">
            Ready to Start Your Zulu Adventure?
          </h2>
          <p className="text-xl mb-8 text-white/95 animate-slide-up drop-shadow-md">
            Join thousands of learners discovering the beauty of the Zulu language and culture
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
            <Link to="/courses">
              <Button size="lg" className="bg-white text-primary hover:bg-white/95 hover-lift hover-glow font-semibold">
                Start Learning Now
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white/80 bg-white/10 text-white hover:bg-white/20 hover-lift backdrop-blur-sm">
                Have Questions?
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
