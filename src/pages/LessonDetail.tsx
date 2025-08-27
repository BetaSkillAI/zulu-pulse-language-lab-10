
import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Play, Pause, Volume2, ArrowLeft, Bookmark, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cellphoneZuluLessons, Lesson } from "@/data/cellphoneZuluLessons";
import LessonQuiz from "@/components/LessonQuiz";

const LessonDetail = () => {
  const { id } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Check if this is a Cellphone Zulu course lesson
  const cellphoneLesson = cellphoneZuluLessons.find(lesson => lesson.id === Number(id));
  
  const lesson = cellphoneLesson || {
    id: id,
    title: "Basic Greetings",
    level: "Beginner",
    lesson: 1,
    totalLessons: 8,
    content: "This is a basic greeting lesson for beginners.",
    description: "Learn essential Zulu greetings and polite expressions",
    quiz: [],
    phrases: [
      {
        zulu: "Sawubona",
        english: "Hello (to one person)",
        phonetic: "sah-wu-BOH-nah",
        audio: "/audio/sawubona.mp3",
      },
      {
        zulu: "Sanibonani",
        english: "Hello (to multiple people)",
        phonetic: "sah-nee-boh-NAH-nee",
        audio: "/audio/sanibonani.mp3",
      },
      {
        zulu: "Unjani?",
        english: "How are you?",
        phonetic: "oon-JAH-nee",
        audio: "/audio/unjani.mp3",
      },
      {
        zulu: "Ngisaphila, wena unjani?",
        english: "I am well, how are you?",
        phonetic: "ngee-sah-PEE-lah, weh-nah oon-JAH-nee",
        audio: "/audio/ngisaphila.mp3",
      },
      {
        zulu: "Ngubani igama lakho?",
        english: "What is your name?",
        phonetic: "ngoo-BAH-nee ee-GAH-mah LAH-kho",
        audio: "/audio/igama.mp3",
      },
      {
        zulu: "Igama lami ngu...",
        english: "My name is...",
        phonetic: "ee-GAH-mah LAH-mee ngoo",
        audio: "/audio/igama-lami.mp3",
      },
      {
        zulu: "Ngingakusiza ngani?",
        english: "How can I help you?",
        phonetic: "ngee-ngah-koo-SEE-zah ngah-nee",
        audio: "/audio/ngingakusiza.mp3",
      },
      {
        zulu: "Hamba kahle",
        english: "Goodbye (to person leaving - Go well)",
        phonetic: "HAM-bah kah-hleh",
        audio: "/audio/hamba-kahle.mp3",
      },
      {
        zulu: "Sala kahle",
        english: "Goodbye (if you are leaving - Stay well)",
        phonetic: "SAH-lah kah-hleh",
        audio: "/audio/sala-kahle.mp3",
      },
      {
        zulu: "Ngikufisela inhlanhla",
        english: "Good luck",
        phonetic: "ngee-koo-fee-SEH-lah een-hlahn-hlah",
        audio: "/audio/inhlanhla.mp3",
      },
      {
        zulu: "Ube nohambo oluhle",
        english: "Have a safe journey",
        phonetic: "oo-beh noh-HAM-boh oh-loo-hleh",
        audio: "/audio/nohambo.mp3",
      },
    ],
  };

  useEffect(() => {
    // Cleanup function to stop audio when component unmounts or lesson changes
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsPlaying(false);
    };
  }, [id]); // Re-run when lesson ID changes

  const playAudio = (index: number) => {
    const phrase = lesson.phrases[index];
    
    // IMMEDIATELY stop any playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    // IMMEDIATELY update state
    setIsPlaying(false);
    setCurrentPhrase(index);
    
    // Create new audio and play IMMEDIATELY
    audioRef.current = new Audio(phrase.audio);
    
    audioRef.current.onended = () => {
      setIsPlaying(false);
      audioRef.current = null;
    };
    
    audioRef.current.onerror = () => {
      toast({
        title: "Audio Not Available",
        description: `Audio for "${phrase.zulu}" is not available yet.`,
      });
      setIsPlaying(false);
      audioRef.current = null;
    };
    
    // Play immediately without await
    audioRef.current.play().then(() => {
      setIsPlaying(true);
      toast({
        title: "Playing",
        description: `${phrase.zulu} - ${phrase.english}`,
      });
    }).catch(() => {
      toast({
        title: "Playback Error",
        description: "Could not play audio.",
        variant: "destructive",
      });
      setIsPlaying(false);
      audioRef.current = null;
    });
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      // Stop current audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsPlaying(false);
    } else {
      // Play current phrase
      playAudio(currentPhrase);
    }
  };

  const handlePhrasePlay = (index: number) => {
    playAudio(index);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Bookmark Removed" : "Lesson Bookmarked",
      description: isBookmarked 
        ? "Removed from your bookmarks" 
        : "Added to your bookmarks for quick access",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/courses">
            <Button variant="ghost" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleBookmark}
            className={`${isBookmarked ? "bg-green-50 border-green-200 text-green-600" : "text-gray-600"}`}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
          </Button>
        </div>

        {/* Lesson Info */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-green-100 text-green-800 border-green-200 font-medium">
            {lesson.level}
          </Badge>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {lesson.title}
          </h1>
          <p className="text-gray-600 mb-4">
            Lesson {lesson.lesson} of {lesson.totalLessons}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 max-w-md mx-auto">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(lesson.lesson / lesson.totalLessons) * 100}%` }}
            />
          </div>
        </div>

        {/* Introduction */}
        {lesson.content && (
          <Card className="mb-8 bg-white border border-gray-200 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-gray-900">{lesson.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {lesson.content}
              </p>
              {lesson.description && (
                <p className="text-gray-600 mt-3">
                  {lesson.description}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Phrases */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {lesson.phrases.map((phrase, index) => (
            <Card 
              key={index} 
              className={`bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 ${
                currentPhrase === index ? "ring-2 ring-green-500 shadow-md" : ""
              }`}
            >
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    {phrase.zulu}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePhrasePlay(index)}
                    className="text-gray-600 hover:text-green-600"
                  >
                    {isPlaying && currentPhrase === index ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-lg text-gray-700 font-medium">
                    {phrase.english}
                  </p>
                  <p className="text-gray-500 italic">
                    Pronunciation: {phrase.phonetic}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handlePhrasePlay(index)}
                    className="text-gray-600 hover:text-green-600"
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    Listen
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handlePhrasePlay(index)}
                    className="text-gray-600 hover:text-green-600"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Repeat
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Practice Section */}
        <Card className="mb-8 bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Practice Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700 font-medium mb-4">
                How to practice this lesson:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex items-start space-x-3">
                  <span className="text-green-600 font-bold">1.</span>
                  <span className="text-gray-700">Listen to each phrase multiple times to get familiar with the pronunciation</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-600 font-bold">2.</span>
                  <span className="text-gray-700">Practice speaking each phrase out loud, focusing on the correct pronunciation</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-600 font-bold">3.</span>
                  <span className="text-gray-700">Try to use these phrases in context with friends or family</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-green-600 font-bold">4.</span>
                  <span className="text-gray-700">Record yourself speaking and compare with the audio</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quiz Section */}
        {lesson.quiz && lesson.quiz.length > 0 && (
          <Card className="mb-8 bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">Test Your Knowledge</CardTitle>
            </CardHeader>
            <CardContent>
              {!showQuiz ? (
                <div className="text-center space-y-4">
                  <p className="text-gray-700">
                    Ready to test what you've learned? Take this quick quiz to reinforce your understanding.
                  </p>
                  <Button 
                    onClick={() => setShowQuiz(true)} 
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Start Quiz
                  </Button>
                </div>
              ) : (
                <LessonQuiz
                  questions={lesson.quiz}
                  onComplete={(score, total) => {
                    toast({
                      title: "Quiz Complete!",
                      description: `You scored ${score} out of ${total} questions correctly!`,
                    });
                    setShowQuiz(false);
                  }}
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          {lesson.lesson > 1 ? (
            <Link to={`/lesson/${lesson.lesson - 1}`}>
              <Button variant="outline" className="text-gray-600 hover:text-gray-900">
                Previous Lesson
              </Button>
            </Link>
          ) : (
            <Button variant="outline" disabled>
              Previous Lesson
            </Button>
          )}
          <Link to="/practice">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Practice These Phrases
            </Button>
          </Link>
          {lesson.lesson < lesson.totalLessons ? (
            <Link to={`/lesson/${lesson.lesson + 1}`}>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Next Lesson
              </Button>
            </Link>
          ) : (
            <Button disabled>
              Next Lesson
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonDetail;
