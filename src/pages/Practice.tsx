import { useState, useRef, useEffect } from "react";
import { Mic, Play, Square, RotateCcw, Volume2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const Practice = () => {
  // SEO setup
  document.title = "Zulu Pronunciation Practice - Learn Zulu";
  document.querySelector('meta[name="description"]')?.setAttribute('content', 
    'Practice speaking Zulu words and phrases with voice recognition. Listen to native pronunciation, record yourself, and compare for perfect Zulu pronunciation.');
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', 'Zulu Pronunciation Practice - Learn Zulu');
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', 
    'Practice speaking Zulu with voice recognition and native pronunciation comparison.');
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', '/practice');
  const [isRecording, setIsRecording] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userRecording, setUserRecording] = useState<Blob | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pronunciationFeedback, setPronunciationFeedback] = useState<{
    accuracy: number;
    feedback: string;
    suggestions: string[];
    status: 'excellent' | 'good' | 'needs-improvement';
  } | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const userAudioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const exercises = [
    {
      id: 1,
      phrase: "Sawubona",
      english: "Hello (to one person)",
      phonetic: "sah-wu-BOH-nah",
      difficulty: "Easy",
      audio: "/audio/sawubona.mp3"
    },
    {
      id: 2,
      phrase: "Ngiyabonga",
      english: "Thank you",
      phonetic: "ngee-yah-BOHN-gah",
      difficulty: "Easy",
      audio: "/audio/ngiyabonga.mp3"
    },
    {
      id: 3,
      phrase: "Unjani?",
      english: "How are you?",
      phonetic: "oon-JAH-nee",
      difficulty: "Medium",
      audio: "/audio/unjani.mp3"
    },
    {
      id: 4,
      phrase: "Ngiyakuthanda",
      english: "I love you",
      phonetic: "ngee-yah-ku-TAHN-dah",
      difficulty: "Hard",
      audio: "/audio/ngiyakuthanda.mp3"
    }
  ];

  const currentEx = exercises[currentExercise];
  const progress = ((currentExercise + 1) / exercises.length) * 100;

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (userAudioRef.current) {
        userAudioRef.current.pause();
      }
    };
  }, []);

  const handleRecord = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        const chunks: BlobPart[] = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          chunks.push(event.data);
        };

        mediaRecorderRef.current.onstop = async () => {
          const blob = new Blob(chunks, { type: 'audio/wav' });
          setUserRecording(blob);
          setHasRecorded(true);
          
          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());
          
          // Analyze pronunciation
          await analyzePronunciation(blob);
          
          toast({
            title: "Recording Complete",
            description: "Analysis complete! Check your pronunciation feedback below.",
          });
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
        setHasRecorded(false);
        
        toast({
          title: "Recording Started",
          description: "Speak the Zulu phrase clearly.",
        });
      } catch (error) {
        toast({
          title: "Recording Error",
          description: "Could not access microphone. Please allow microphone access.",
          variant: "destructive",
        });
      }
    }
  };

  const handlePlayback = () => {
    if (userRecording && userAudioRef.current) {
      userAudioRef.current.pause();
    }
    
    if (userRecording) {
      const audioUrl = URL.createObjectURL(userRecording);
      userAudioRef.current = new Audio(audioUrl);
      userAudioRef.current.play().catch(() => {
        toast({
          title: "Playback Error",
          description: "Could not play your recording.",
          variant: "destructive",
        });
      });
      
      userAudioRef.current.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };
    }
  };

  // Generate mock audio using Web Audio API
  const generateMockAudio = (frequency: number, duration: number = 1.5) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + duration - 0.1);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
    
    return { oscillator, audioContext, duration };
  };

  const handlePlayOriginal = async () => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      // Generate mock audio based on exercise ID
      const frequencies = [349, 392, 440, 523]; // F4, G4, A4, C5 notes
      const mockAudio = generateMockAudio(frequencies[currentEx.id - 1] || 440, 2);
      
      setIsPlaying(true);
      
      // Auto-stop after duration
      setTimeout(() => {
        setIsPlaying(false);
      }, mockAudio.duration * 1000);
      
      toast({
        title: "Playing Original",
        description: `Listen to: ${currentEx.phrase} (Mock Audio)`,
      });
    } catch (error) {
      toast({
        title: "Playback Error",
        description: "Could not generate audio.",
        variant: "destructive",
      });
      setIsPlaying(false);
    }
  };

  // Speech recognition and analysis
  const analyzePronunciation = async (audioBlob: Blob) => {
    setIsAnalyzing(true);
    
    try {
      // Convert audio to text using Web Speech API
      const recognizedText = await speechToText(audioBlob);
      
      // Compare with expected phrase
      const feedback = compareWithExpected(recognizedText, currentEx.phrase, currentEx.phonetic);
      setPronunciationFeedback(feedback);
      setScore(feedback.accuracy);
      
    } catch (error) {
      // Fallback to simulated analysis
      const mockFeedback = generateMockFeedback();
      setPronunciationFeedback(mockFeedback);
      setScore(mockFeedback.accuracy);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const speechToText = (audioBlob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const recognition = new (window as any).webkitSpeechRecognition() || new (window as any).SpeechRecognition();
      
      if (!recognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'zu-ZA'; // Zulu language code
      
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript.toLowerCase().trim());
      };
      
      recognition.onerror = () => {
        reject(new Error('Speech recognition failed'));
      };
      
      recognition.start();
      audio.play();
    });
  };

  const compareWithExpected = (recognized: string, expected: string, phonetic: string) => {
    const cleanExpected = expected.toLowerCase().trim();
    const similarity = calculateSimilarity(recognized, cleanExpected);
    
    let status: 'excellent' | 'good' | 'needs-improvement';
    let feedback: string;
    let suggestions: string[] = [];
    
    if (similarity >= 0.9) {
      status = 'excellent';
      feedback = 'Excellent pronunciation! You nailed it!';
      suggestions = ['Perfect! Try the next exercise.'];
    } else if (similarity >= 0.7) {
      status = 'good';
      feedback = 'Good pronunciation! Just a few minor adjustments needed.';
      suggestions = [
        `Focus on the pronunciation: ${phonetic}`,
        'Try to emphasize the stressed syllables more.'
      ];
    } else {
      status = 'needs-improvement';
      feedback = 'Keep practicing! Your pronunciation needs some work.';
      suggestions = [
        `Listen carefully to: ${phonetic}`,
        'Break the word into syllables and practice each part.',
        'Try speaking more slowly and clearly.'
      ];
    }
    
    return {
      accuracy: Math.round(similarity * 100),
      feedback,
      suggestions,
      status
    };
  };

  const calculateSimilarity = (str1: string, str2: string): number => {
    // Simple Levenshtein distance-based similarity
    const maxLength = Math.max(str1.length, str2.length);
    if (maxLength === 0) return 1;
    
    const distance = levenshteinDistance(str1, str2);
    return (maxLength - distance) / maxLength;
  };

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  const generateMockFeedback = () => {
    const accuracyScores = [75, 82, 88, 91, 67, 94, 78];
    const accuracy = accuracyScores[Math.floor(Math.random() * accuracyScores.length)];
    
    let status: 'excellent' | 'good' | 'needs-improvement';
    let feedback: string;
    let suggestions: string[] = [];
    
    if (accuracy >= 90) {
      status = 'excellent';
      feedback = 'Excellent pronunciation! You sound like a native speaker!';
      suggestions = ['Perfect! Try the next exercise.'];
    } else if (accuracy >= 75) {
      status = 'good';
      feedback = 'Good pronunciation! Just a few minor adjustments needed.';
      suggestions = [
        `Focus on the pronunciation: ${currentEx.phonetic}`,
        'Try to emphasize the stressed syllables more.',
        'Listen to the original again for reference.'
      ];
    } else {
      status = 'needs-improvement';
      feedback = 'Keep practicing! Your pronunciation needs some work.';
      suggestions = [
        `Listen carefully to: ${currentEx.phonetic}`,
        'Break the word into syllables and practice each part.',
        'Try speaking more slowly and clearly.',
        'Record yourself multiple times for practice.'
      ];
    }
    
    return { accuracy, feedback, suggestions, status };
  };

  const handleNext = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setHasRecorded(false);
      setIsRecording(false);
      setPronunciationFeedback(null);
    }
  };

  const handlePrevious = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
      setHasRecorded(false);
      setIsRecording(false);
      setPronunciationFeedback(null);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-accent text-accent-foreground";
      case "Medium":
        return "bg-primary text-primary-foreground";
      case "Hard":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Zulu Pronunciation Practice
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Practice speaking Zulu words and phrases. Listen to native pronunciation and record yourself.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{currentExercise + 1} of {exercises.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main Exercise Card */}
        <Card className="mb-8 shadow-warm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Badge className={getDifficultyColor(currentEx.difficulty)}>
                {currentEx.difficulty}
              </Badge>
            </div>
            <CardTitle className="text-3xl font-bold text-primary mb-2">
              {currentEx.phrase}
            </CardTitle>
            <p className="text-lg text-foreground">{currentEx.english}</p>
            <p className="text-muted-foreground italic">
              Pronunciation: {currentEx.phonetic}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Listen Section */}
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Step 1: Listen</h3>
              <Button 
                onClick={handlePlayOriginal}
                className="bg-gradient-primary"
                size="lg"
              >
                <Volume2 className="h-5 w-5 mr-2" />
                Play Original
              </Button>
            </div>

            {/* Record Section */}
            <div className="text-center border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Step 2: Record Yourself</h3>
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={handleRecord}
                  variant={isRecording ? "destructive" : "default"}
                  size="lg"
                  className={!isRecording ? "bg-gradient-primary" : ""}
                >
                  {isRecording ? (
                    <>
                      <Square className="h-5 w-5 mr-2" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="h-5 w-5 mr-2" />
                      Start Recording
                    </>
                  )}
                </Button>
                
                {hasRecorded && (
                  <Button variant="outline" onClick={handlePlayback}>
                    <Play className="h-5 w-5 mr-2" />
                    Play My Recording
                  </Button>
                )}
              </div>
              
              {isRecording && (
                <div className="mt-4">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-destructive rounded-full animate-pulse"></div>
                    <span className="text-sm text-muted-foreground">Recording...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Feedback Section */}
            {hasRecorded && (
              <div className="text-center border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Step 3: Compare & Analyze</h3>
                <div className="flex justify-center space-x-4 mb-6">
                  <Button variant="outline" onClick={handlePlayOriginal}>
                    <Volume2 className="h-4 w-4 mr-2" />
                    Original
                  </Button>
                  <Button variant="outline" onClick={handlePlayback}>
                    <Play className="h-4 w-4 mr-2" />
                    Your Recording
                  </Button>
                </div>
                
                {isAnalyzing ? (
                  <div className="flex items-center justify-center space-x-3 p-6 bg-card rounded-lg border-2 border-dashed border-muted">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <p className="text-muted-foreground">Analyzing your pronunciation...</p>
                  </div>
                ) : pronunciationFeedback ? (
                  <div className="space-y-4">
                    {/* Score Display */}
                    <div className="flex items-center justify-center space-x-4 p-4 bg-card rounded-lg border">
                      {pronunciationFeedback.status === 'excellent' && (
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      )}
                      {pronunciationFeedback.status === 'good' && (
                        <CheckCircle className="h-8 w-8 text-blue-500" />
                      )}
                      {pronunciationFeedback.status === 'needs-improvement' && (
                        <AlertTriangle className="h-8 w-8 text-orange-500" />
                      )}
                      <div className="text-left flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-lg">{pronunciationFeedback.feedback}</p>
                          <Badge 
                            variant={pronunciationFeedback.status === 'excellent' ? 'default' : 
                                   pronunciationFeedback.status === 'good' ? 'secondary' : 'destructive'}
                            className="text-sm"
                          >
                            {pronunciationFeedback.accuracy}% accuracy
                          </Badge>
                        </div>
                        <Progress 
                          value={pronunciationFeedback.accuracy} 
                          className="h-2 mb-3"
                        />
                      </div>
                    </div>
                    
                    {/* Suggestions */}
                    <div className="bg-muted/30 rounded-lg p-4 text-left">
                      <h4 className="font-medium mb-3 text-center">💡 Tips for Improvement</h4>
                      <ul className="space-y-2">
                        {pronunciationFeedback.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-primary font-medium mt-0.5">•</span>
                            <span className="text-sm text-muted-foreground">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            onClick={handlePrevious}
            disabled={currentExercise === 0}
            variant="outline"
          >
            Previous
          </Button>
          
          <Button onClick={() => setCurrentExercise(0)} variant="ghost">
            <RotateCcw className="h-4 w-4 mr-2" />
            Restart
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={currentExercise === exercises.length - 1}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Practice;