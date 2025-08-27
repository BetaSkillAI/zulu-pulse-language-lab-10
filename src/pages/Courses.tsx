
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
      title: "Basic Zulu Language Course",
      level: "Beginner",
      lessons: 26,
      duration: "3.5 hrs",
      description: "Comprehensive Zulu language course covering pronunciation, vocabulary, and practical conversations",
      progress: 0,
    },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800 border-green-200";
      case "Intermediate":
        return "bg-green-200 text-green-800 border-green-300";
      case "Advanced":
        return "bg-green-300 text-green-900 border-green-400";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Zulu Language Courses
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Master Zulu step by step with our structured learning path. Each course builds on the previous one to ensure steady progress.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card 
              key={course.id} 
              className="group bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge className={`${getLevelColor(course.level)} font-medium`}>
                    {course.level}
                  </Badge>
                  <div className="flex items-center text-gray-500">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm font-medium">4.8</span>
                  </div>
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {course.title}
                </CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {course.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Book className="h-4 w-4 mr-2" />
                    {course.lessons} lessons
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {course.duration}
                  </div>
                </div>

                {course.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                                          <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    />
                    </div>
                  </div>
                )}

                <Link to={`/lesson/${course.id}`}>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 transition-colors">
                    <span>
                      {course.progress > 0 ? "Continue Learning" : "Start Course"}
                    </span>
                    <Play className="h-4 w-4 ml-2" />
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
