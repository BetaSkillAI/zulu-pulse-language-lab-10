
import { Book, Play, Star, Clock, Award, Target, Users, Calendar, CheckCircle, Lock, Trophy, TrendingUp, BookOpen, Headphones, Mic, Globe, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

const Courses = () => {
  // SEO setup
  document.title = "Zulu Language Courses - Learn Zulu | Learn Zulu";
  document.querySelector('meta[name="description"]')?.setAttribute('content', 
    'Master Zulu step by step with our structured learning path. Choose from beginner to advanced courses with interactive lessons, native audio, and cultural context.');
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', 'Zulu Language Courses - Learn Zulu');
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', 
    'Master Zulu step by step with our structured learning path. Choose from beginner to advanced courses with interactive lessons.');
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', '/courses');
  
  // Mock user data - in a real app this would come from context/API
  const userStats = {
    totalLessonsCompleted: 12,
    totalLessons: 26,
    currentStreak: 7,
    totalStudyTime: "8.5 hrs",
    averageScore: 87,
    badges: 5,
    level: "Intermediate",
    experience: 1250
  };

  const courses = [
    {
      id: 1,
      title: "Complete Zulu Language Course",
      level: "Beginner to Advanced",
      lessons: 26,
      duration: "15 hrs",
      description: "Master Zulu from basics to fluency with comprehensive lessons covering pronunciation, vocabulary, grammar, and cultural context",
      progress: 46, // 12/26 lessons completed
      completedLessons: 12,
      totalLessons: 26,
      rating: 4.8,
      students: 1247,
      lastAccessed: "2 days ago",
      nextLesson: "Lesson 13: Advanced Greetings",
      comingSoon: false,
      modules: [
        { id: 1, title: "Pronunciation Fundamentals", lessons: 5, completed: 5, locked: false },
        { id: 2, title: "Basic Greetings & Introductions", lessons: 4, completed: 4, locked: false },
        { id: 3, title: "Numbers & Counting", lessons: 3, completed: 3, locked: false },
        { id: 4, title: "Advanced Greetings", lessons: 4, completed: 0, locked: false },
        { id: 5, title: "Family & Relationships", lessons: 3, completed: 0, locked: true },
        { id: 6, title: "Daily Conversations", lessons: 4, completed: 0, locked: true },
        { id: 7, title: "Cultural Context", lessons: 3, completed: 0, locked: true }
      ],
      features: ["Native Audio", "Interactive Quizzes", "Progress Tracking", "Cultural Notes", "Practice Exercises"],
      certificate: true
    },
    {
      id: 2,
      title: "Zulu for Business",
      level: "Intermediate",
      lessons: 18,
      duration: "12 hrs",
      description: "Learn professional Zulu for business meetings, negotiations, and workplace communication",
      progress: 0,
      completedLessons: 0,
      totalLessons: 18,
      rating: 4.9,
      students: 892,
      lastAccessed: null,
      nextLesson: null,
      comingSoon: true,
      modules: [
        { id: 1, title: "Business Greetings", lessons: 3, completed: 0, locked: false },
        { id: 2, title: "Meeting Vocabulary", lessons: 4, completed: 0, locked: true },
        { id: 3, title: "Negotiation Phrases", lessons: 4, completed: 0, locked: true },
        { id: 4, title: "Email & Correspondence", lessons: 3, completed: 0, locked: true },
        { id: 5, title: "Cultural Business Etiquette", lessons: 4, completed: 0, locked: true }
      ],
      features: ["Business Scenarios", "Role-Playing", "Cultural Etiquette", "Professional Audio"],
      certificate: true
    },
    {
      id: 3,
      title: "Zulu Music & Culture",
      level: "All Levels",
      lessons: 12,
      duration: "8 hrs",
      description: "Explore Zulu culture through music, traditional songs, and cultural expressions",
      progress: 0,
      completedLessons: 0,
      totalLessons: 12,
      rating: 4.7,
      students: 634,
      lastAccessed: null,
      nextLesson: null,
      comingSoon: true,
      modules: [
        { id: 1, title: "Traditional Songs", lessons: 4, completed: 0, locked: false },
        { id: 2, title: "Modern Zulu Music", lessons: 3, completed: 0, locked: true },
        { id: 3, title: "Cultural Stories", lessons: 3, completed: 0, locked: true },
        { id: 4, title: "Dance & Celebration", lessons: 2, completed: 0, locked: true }
      ],
      features: ["Music Videos", "Karaoke Mode", "Cultural Stories", "Interactive Singing"],
      certificate: false
    }
  ];

  const badges = [
    { id: 1, name: "First Steps", icon: "🎯", description: "Complete your first lesson", earned: true },
    { id: 2, name: "Week Warrior", icon: "🔥", description: "Study for 7 days in a row", earned: true },
    { id: 3, name: "Perfect Score", icon: "⭐", description: "Get 100% on a quiz", earned: true },
    { id: 4, name: "Pronunciation Master", icon: "🎤", description: "Complete pronunciation module", earned: true },
    { id: 5, name: "Conversation Starter", icon: "💬", description: "Complete greetings module", earned: true },
    { id: 6, name: "Culture Explorer", icon: "🌍", description: "Learn about Zulu culture", earned: false },
    { id: 7, name: "Business Ready", icon: "💼", description: "Complete business course", earned: false },
    { id: 8, name: "Music Lover", icon: "🎵", description: "Complete music course", earned: false }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800 border-green-200";
      case "Intermediate":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Advanced":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Beginner to Advanced":
        return "bg-gradient-to-r from-green-100 to-blue-100 text-green-800 border-green-200";
      case "All Levels":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const [courseOverviewModal, setCourseOverviewModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const openCourseOverview = (course) => {
    setSelectedCourse(course);
    setCourseOverviewModal(true);
  };

  const closeCourseOverview = () => {
    setCourseOverviewModal(false);
    setSelectedCourse(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with User Stats */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, Learner! 👋
              </h1>
              <p className="text-gray-600">
                Continue your Zulu language journey with our comprehensive courses
              </p>
            </div>
            <div className="mt-4 lg:mt-0">
              <Link to="/practice">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Target className="h-4 w-4 mr-2" />
                  Practice Now
                </Button>
              </Link>
            </div>
          </div>

          {/* User Progress Dashboard */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{userStats.totalLessonsCompleted}</div>
                  <div className="text-sm text-gray-600">Lessons Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{userStats.currentStreak}</div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{userStats.totalStudyTime}</div>
                  <div className="text-sm text-gray-600">Study Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{userStats.averageScore}%</div>
                  <div className="text-sm text-gray-600">Average Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{userStats.badges}</div>
                  <div className="text-sm text-gray-600">Badges Earned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{userStats.level}</div>
                  <div className="text-sm text-gray-600">Current Level</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Course */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Learning Path</h2>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              {userStats.totalLessonsCompleted}/{userStats.totalLessons} Lessons
            </Badge>
          </div>

          {courses.map((course) => (
            <Card key={course.id} className="bg-white border border-gray-200 shadow-sm mb-6">
              <CardHeader className="pb-4">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={`${getLevelColor(course.level)} font-medium`}>
                        {course.level}
                      </Badge>
                      <div className="flex items-center space-x-4">
                        {course.comingSoon && (
                          <Badge className="bg-orange-100 text-orange-800 border-orange-200 font-medium">
                            Coming Soon
                          </Badge>
                        )}
                        <div className="flex items-center text-gray-500">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1 text-sm font-medium">{course.rating}</span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Users className="h-4 w-4 mr-1" />
                          <span className="text-sm">{course.students}</span>
                        </div>
                        {course.certificate && (
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            <Award className="h-3 w-3 mr-1" />
                            Certificate
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed mb-4">
                      {course.description}
                    </CardDescription>
                    
                    {/* Course Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {course.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    {/* Progress Section */}
                    {course.progress > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Course Progress</span>
                          <span className="font-medium text-gray-900">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>{course.completedLessons} of {course.totalLessons} lessons completed</span>
                          <span>{course.lastAccessed}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Course Modules */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Course Modules</h4>
                  <div className="space-y-2">
                    {course.modules.map((module) => (
                      <div key={module.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {module.locked ? (
                            <Lock className="h-4 w-4 text-gray-400" />
                          ) : module.completed === module.lessons ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <BookOpen className="h-4 w-4 text-blue-600" />
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{module.title}</div>
                            <div className="text-sm text-gray-500">
                              {module.completed}/{module.lessons} lessons
                            </div>
                          </div>
                        </div>
                        {!module.locked && (
                          <Link to={`/lesson/${module.id}`}>
                            <Button variant="outline" size="sm">
                              {module.completed === module.lessons ? "Review" : "Continue"}
                            </Button>
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">{course.lessons}</div>
                    <div className="text-sm text-gray-600">Total Lessons</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">{course.duration}</div>
                    <div className="text-sm text-gray-600">Duration</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">{course.modules.length}</div>
                    <div className="text-sm text-gray-600">Modules</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">{course.rating}</div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {course.comingSoon ? (
                    <div className="w-full text-center py-4">
                      <Badge className="bg-gray-400 text-white border-gray-500 text-lg px-6 py-3">
                        🚀 Coming Soon
                      </Badge>
                      <p className="text-gray-500 mt-2 text-sm">
                        We're working hard to bring you this course. Stay tuned!
                      </p>
                    </div>
                  ) : course.progress > 0 ? (
                    <>
                      <Link to={`/lesson/${course.nextLesson}`} className="flex-1">
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                          <Play className="h-4 w-4 mr-2" />
                          Continue Learning
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        className="w-full flex-1"
                        onClick={() => openCourseOverview(course)}
                      >
                        <Book className="h-4 w-4 mr-2" />
                        Course Overview
                      </Button>
                    </>
                  ) : (
                    <Link to={`/lesson/${course.id}`} className="flex-1">
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                        <Play className="h-4 w-4 mr-2" />
                        Start Course
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Badges Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Achievements</h2>
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
              {badges.filter(b => b.earned).length}/{badges.length} Badges
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {badges.map((badge) => (
              <Card 
                key={badge.id} 
                className={`text-center p-4 transition-all duration-200 ${
                  badge.earned 
                    ? "bg-white border-green-200 shadow-sm hover:shadow-md" 
                    : "bg-gray-50 border-gray-200 opacity-60"
                }`}
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <div className={`font-medium text-sm ${badge.earned ? "text-gray-900" : "text-gray-500"}`}>
                  {badge.name}
                </div>
                <div className={`text-xs ${badge.earned ? "text-gray-600" : "text-gray-400"}`}>
                  {badge.description}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Learning Tips */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Learning Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Headphones className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Listen Daily</h4>
                  <p className="text-sm text-gray-600">Practice listening to native speakers for 15 minutes daily</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Mic className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Speak Out Loud</h4>
                  <p className="text-sm text-gray-600">Practice pronunciation by repeating phrases aloud</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Globe className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Cultural Context</h4>
                  <p className="text-sm text-gray-600">Learn about Zulu culture to better understand the language</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Overview Modal */}
        {courseOverviewModal && selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedCourse.title}</h2>
                  <p className="text-gray-600 mt-1">{selectedCourse.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeCourseOverview}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Course Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">{selectedCourse.lessons}</div>
                    <div className="text-sm text-gray-600">Total Lessons</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">{selectedCourse.duration}</div>
                    <div className="text-sm text-gray-600">Duration</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">{selectedCourse.modules.length}</div>
                    <div className="text-sm text-gray-600">Modules</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">{selectedCourse.rating}</div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </div>
                </div>

                {/* Course Features */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Course Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCourse.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Detailed Curriculum */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Detailed Curriculum</h3>
                  <div className="space-y-3">
                    {selectedCourse.modules.map((module) => (
                      <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{module.title}</h4>
                          <Badge className={`${
                            module.locked 
                              ? "bg-gray-100 text-gray-600 border-gray-200" 
                              : "bg-blue-100 text-blue-800 border-blue-200"
                          }`}>
                            {module.locked ? "Locked" : `${module.completed}/${module.lessons} lessons`}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <BookOpen className="h-4 w-4" />
                          <span>{module.lessons} lessons</span>
                          {module.locked && <Lock className="h-4 w-4" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Course Progress (if any) */}
                {selectedCourse.progress > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Progress</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Course Progress</span>
                        <span className="font-medium text-gray-900">{selectedCourse.progress}%</span>
                      </div>
                      <Progress value={selectedCourse.progress} className="h-3" />
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>{selectedCourse.completedLessons} of {selectedCourse.totalLessons} lessons completed</span>
                        <span>Last accessed: {selectedCourse.lastAccessed}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                <Button variant="outline" onClick={closeCourseOverview}>
                  Close
                </Button>
                {selectedCourse.progress > 0 ? (
                  <Link to={`/lesson/${selectedCourse.nextLesson}`}>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <Play className="h-4 w-4 mr-2" />
                      Continue Learning
                    </Button>
                  </Link>
                ) : (
                  <Link to={`/lesson/${selectedCourse.id}`}>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <Play className="h-4 w-4 mr-2" />
                      Start Course
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
