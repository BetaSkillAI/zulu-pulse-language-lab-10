
import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Play, Pause, Volume2, ArrowLeft, Bookmark, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const LessonDetail = () => {
  const { id } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const lesson = {
    id: id,
    title: "Basic Greetings",
    level: "Beginner",
    lesson: 1,
    totalLessons: 8,
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
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlayPause = async () => {
    const phrase = lesson.phrases[currentPhrase];
    
    try {
      if (isPlaying) {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setIsPlaying(false);
      } else {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        
        audioRef.current = new Audio(phrase.audio);
        audioRef.current.onended = () => setIsPlaying(false);
        audioRef.current.onerror = () => {
          toast({
            title: "Audio Error",
            description: "Could not play audio file. Using placeholder audio.",
            variant: "destructive",
          });
          setIsPlaying(false);
        };
        
        await audioRef.current.play();
        setIsPlaying(true);
        
        toast({
          title: "Playing",
          description: `${phrase.zulu} - ${phrase.english}`,
        });
      }
    } catch (error) {
      toast({
        title: "Playback Error",
        description: "Could not play audio. This is a demo with placeholder audio files.",
        variant: "destructive",
      });
      setIsPlaying(false);
    }
  };

  const handlePhrasePlay = async (index: number) => {
    const phrase = lesson.phrases[index];
    
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      audioRef.current = new Audio(phrase.audio);
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.onerror = () => {
        toast({
          title: "Audio Error",
          description: "Could not play audio file. This is a demo with placeholder audio.",
          variant: "destructive",
        });
      };
      
      await audioRef.current.play();
      setCurrentPhrase(index);
      
      toast({
        title: "Playing",
        description: `${phrase.zulu} - ${phrase.english}`,
      });
    } catch (error) {
      toast({
        title: "Playback Error",
        description: "Could not play audio. This is a demo with placeholder audio files.",
        variant: "destructive",
      });
    }
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
    <div className="min-h-screen bg-gradient-secondary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/courses">
            <Button variant="ghost" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleBookmark}
            className={isBookmarked ? "bg-primary text-primary-foreground" : ""}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
          </Button>
        </div>

        {/* Lesson Info */}
        <div className="text-center mb-8">
          <Badge className="mb-4">{lesson.level}</Badge>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {lesson.title}
          </h1>
          <p className="text-muted-foreground">
            Lesson {lesson.lesson} of {lesson.totalLessons}
          </p>
          <div className="w-full bg-secondary rounded-full h-2 mt-4 max-w-md mx-auto">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${(lesson.lesson / lesson.totalLessons) * 100}%` }}
            />
          </div>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-primary">About Greetings in isiZulu</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground mb-4">
              Greeting is a very important part of human interaction everywhere in the world. 
              Here are some of the basic greeting phrases used in isiZulu.
            </p>
          </CardContent>
        </Card>

        {/* Phrases */}
        <div className="space-y-6 mb-8">
          {lesson.phrases.map((phrase, index) => (
            <Card 
              key={index} 
              className={`transition-all hover:shadow-warm ${
                currentPhrase === index ? "ring-2 ring-primary shadow-warm" : ""
              }`}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">
                    {phrase.zulu}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setCurrentPhrase(index);
                      handlePlayPause();
                    }}
                  >
                    {isPlaying && currentPhrase === index ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-lg text-foreground mb-1">
                    {phrase.english}
                  </p>
                  <p className="text-muted-foreground italic">
                    Pronunciation: {phrase.phonetic}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => handlePhrasePlay(index)}
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    Listen
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => handlePhrasePlay(index)}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Repeat
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Conversation Example */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-primary">Sample Conversation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-foreground font-semibold mb-4">
                The conversation would go as follows:
              </p>
              <div className="bg-secondary/30 p-4 rounded-lg space-y-3">
                <div className="flex flex-col space-y-1">
                  <span className="font-semibold text-primary">John:</span>
                  <span className="text-foreground">'Sawubona' (Plural – 'Sanibona')</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="font-semibold text-primary">Peter:</span>
                  <span className="text-foreground">'Yebo sawubona'</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="font-semibold text-primary">John:</span>
                  <span className="text-foreground">'Kunjani' or 'Unjani' (Plural – 'Ninjani')</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="font-semibold text-primary">Peter:</span>
                  <span className="text-foreground">'Ngisaphila, wena unjani' (Plural – 'Sisaphila, nina ninjani')</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="font-semibold text-primary">John:</span>
                  <span className="text-foreground">'Nami ngisaphila'</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-12">
          {lesson.lesson > 1 ? (
            <Link to={`/lesson/${lesson.lesson - 1}`}>
              <Button variant="outline">
                Previous Lesson
              </Button>
            </Link>
          ) : (
            <Button variant="outline" disabled>
              Previous Lesson
            </Button>
          )}
          <Link to="/practice">
            <Button>
              Practice These Phrases
            </Button>
          </Link>
          {lesson.lesson < lesson.totalLessons ? (
            <Link to={`/lesson/${lesson.lesson + 1}`}>
              <Button>
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
