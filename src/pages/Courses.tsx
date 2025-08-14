
import { Book, Play, Star, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Courses = () => {
  // SEO setup
  document.title = "Zulu Language Courses - Learn Zulu | Learn Zulu";
  document.querySelector('meta[name="description"]')?.setAttribute('content', 
    'Master Zulu step by step with our structured learning path. Choose from beginner to advanced courses with interactive lessons, native audio, and cultural context.');
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', 'Zulu Language Courses - Learn Zulu');
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', 
    'Master Zulu step by step with our structured learning path. Choose from beginner to advanced courses with interactive lessons.');
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', '/courses');
  const courses = [
    {
      id: 1,
      title: "Basic Greetings",
      level: "Beginner",
      lessons: 8,
      duration: "45 min",
      description: "Learn essential Zulu greetings and polite expressions",
      progress: 0,
    },
    {
      id: 2,
      title: "Family & Relationships",
      level: "Beginner",
      lessons: 12,
      duration: "1.2 hrs",
      description: "Vocabulary for family members and relationships",
      progress: 25,
    },
    {
      id: 3,
      title: "Food & Dining",
      level: "Intermediate",
      lessons: 15,
      duration: "1.8 hrs",
      description: "Learn food vocabulary and dining expressions",
      progress: 60,
    },
    {
      id: 4,
      title: "Business Conversations",
      level: "Advanced",
      lessons: 20,
      duration: "2.5 hrs",
      description: "Professional Zulu for workplace communication",
      progress: 0,
    },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-accent text-accent-foreground";
      case "Intermediate":
        return "bg-primary text-primary-foreground";
      case "Advanced":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-pulse relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-20 right-10 w-60 h-60 bg-primary/5 rounded-full animate-float"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-accent/10 rounded-full animate-float-delayed"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-4xl font-bold text-white mb-4">
            Zulu Language Courses
          </h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Master Zulu step by step with our structured learning path. Each course builds on the previous one to ensure steady progress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-stagger-children">
          {courses.map((course) => (
            <Card key={course.id} className="hover-lift hover-glow transition-all group bg-card/80 backdrop-blur-sm border-2 border-transparent hover:border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className={`${getLevelColor(course.level)} glow-primary`}>
                    {course.level}
                  </Badge>
                  <div className="flex items-center text-muted-foreground">
                    <Star className="h-4 w-4 fill-current animate-float" />
                    <span className="ml-1 text-sm">4.8</span>
                  </div>
                </div>
                <CardTitle className="group-hover:text-primary transition-colors">
                  {course.title}
                </CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <Book className="h-4 w-4 mr-1" />
                    {course.lessons} lessons
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.duration}
                  </div>
                </div>

                {course.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-gradient-primary h-2 rounded-full transition-all glow-primary"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <Link to={`/lesson/${course.id}`}>
                  <Button className="w-full group bg-gradient-primary hover-lift hover-glow">
                    {course.progress > 0 ? "Continue Learning" : "Start Course"}
                    <Play className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
