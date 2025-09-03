
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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Learn Zulu with
                <span className="block text-green-200">Heart & Soul</span>
              </h1>
              <p className="text-xl mb-8 text-green-100 leading-relaxed">
                Discover the beautiful Zulu language through interactive lessons, 
                traditional music, and authentic cultural experiences. 
                Start your journey today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/courses">
                  <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-semibold">
                    <Play className="h-5 w-5 mr-2" />
                    Start Learning Free
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="border-white/80 bg-white/10 text-white hover:bg-white/20">
                    Have Questions?
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Learn Zulu - Interactive language learning with cultural experiences" 
                className="rounded-lg shadow-lg w-full h-auto"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-green-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Choose Learn Zulu?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the most comprehensive and culturally authentic Zulu learning platform designed for modern learners
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <feature.icon className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                Your Zulu Learning Journey
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Start with Basics</h3>
                    <p className="text-gray-600">Learn essential greetings, family terms, and everyday expressions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Practice Speaking</h3>
                    <p className="text-gray-600">Use our voice recognition to perfect your pronunciation</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Immerse in Culture</h3>
                    <p className="text-gray-600">Learn through traditional songs and cultural stories</p>
                  </div>
                </div>
              </div>
              <Link to="/courses" className="inline-block mt-8">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                  Start Your Journey
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-gray-900">Beginner</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">8 lessons • 45 minutes</p>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-sm text-gray-700">Perfect for beginners</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-gray-900">Intermediate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">15 lessons • 2 hours</p>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-blue-400 text-blue-400 mr-1" />
                    <span className="text-sm text-gray-700">Build confidence</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-gray-900">Advanced</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">25 lessons • 4 hours</p>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-purple-400 text-purple-400 mr-1" />
                    <span className="text-sm text-gray-700">Master the language</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-gray-900">Cultural</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">50+ songs • Ongoing</p>
                  <div className="flex items-center">
                    <Music className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-gray-700">Songs & stories</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Zulu Adventure?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Join thousands of learners discovering the beauty of the Zulu language and culture
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/courses">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-semibold">
                Start Learning Now
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-white/80 bg-white/10 text-white hover:bg-white/20">
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
