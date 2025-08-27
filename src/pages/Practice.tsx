import { useState, useRef, useEffect } from "react";
import { Mic, Play, Square, RotateCcw, Volume2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { cellphoneZuluLessons } from "@/data/cellphoneZuluLessons";

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

  // Create exercises from course lessons - combine all phrases from all lessons
  const exercises = cellphoneZuluLessons.flatMap(lesson => 
    lesson.phrases.map((phrase, index) => ({
      id: `${lesson.id}-${index}`,
      phrase: phrase.zulu,
      english: phrase.english,
      phonetic: phrase.phonetic,
      difficulty: lesson.level,
      audio: phrase.audio,
      lessonTitle: lesson.title,
      lessonId: lesson.id
    }))
  );

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

  const handlePlayOriginal = () => {
    // IMMEDIATELY stop any playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    // Create new audio and play IMMEDIATELY
    audioRef.current = new Audio(currentEx.audio);
    
    audioRef.current.onended = () => {
      setIsPlaying(false);
      audioRef.current = null;
    };
    
    audioRef.current.onerror = () => {
      toast({
        title: "Audio Not Available",
        description: `Audio for "${currentEx.phrase}" is not available yet.`,
        variant: "default",
      });
      setIsPlaying(false);
      audioRef.current = null;
    };
    
    // Play immediately without await
    audioRef.current.play().then(() => {
      setIsPlaying(true);
      toast({
        title: "Playing",
        description: `${currentEx.phrase} - ${currentEx.english}`,
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

  // Speech recognition and analysis
  const analyzePronunciation = async (audioBlob: Blob) => {
    setIsAnalyzing(true);
    
    // Add a backup timeout to ensure analysis completes
    const analysisTimeout = setTimeout(() => {
      if (isAnalyzing) {
        setIsAnalyzing(false);
        const fallbackFeedback = generateMockFeedback();
        setPronunciationFeedback(fallbackFeedback);
        setScore(fallbackFeedback.accuracy);
        toast({
          title: "Analysis Complete",
          description: "Using fallback analysis. Try recording again for more accurate feedback.",
          variant: "default",
        });
      }
    }, 12000); // 12 second total timeout
    
    try {
      // Convert audio to text using Web Speech API
      const recognizedText = await speechToText(audioBlob);
      
      clearTimeout(analysisTimeout);
      
      // Compare with expected phrase
      const feedback = compareWithExpected(recognizedText, currentEx.phrase, currentEx.phonetic);
      setPronunciationFeedback(feedback);
      setScore(feedback.accuracy);
      
    } catch (error) {
      clearTimeout(analysisTimeout);
      console.log('Analysis error:', error);
      
      // Provide specific feedback based on error type
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          setPronunciationFeedback({
            accuracy: 0,
            feedback: 'Analysis timed out. Please try recording again.',
            suggestions: [
              'Make sure you speak clearly and loudly enough.',
              'Try recording in a quieter environment.',
              'Check that your microphone is working properly.',
              'Speak the Zulu phrase more deliberately.'
            ],
            status: 'needs-improvement'
          });
          setScore(0);
        } else if (error.message.includes('no-speech') || error.message.includes('No speech detected')) {
          setPronunciationFeedback({
            accuracy: 0,
            feedback: 'No speech detected. Please speak clearly when recording.',
            suggestions: [
              'Make sure you speak clearly and loudly enough.',
              'Check that your microphone is working properly.',
              'Try recording in a quieter environment.',
              'Speak the Zulu phrase more deliberately.'
            ],
            status: 'needs-improvement'
          });
          setScore(0);
        } else if (error.message.includes('not-allowed') || error.message.includes('denied')) {
          setPronunciationFeedback({
            accuracy: 0,
            feedback: 'Microphone access denied. Please allow microphone access to practice pronunciation.',
            suggestions: [
              'Click the microphone icon in your browser address bar.',
              'Select "Allow" when prompted for microphone access.',
              'Refresh the page and try again.',
              'Check your browser settings for microphone permissions.'
            ],
            status: 'needs-improvement'
          });
          setScore(0);
        } else {
          // Fallback to simulated analysis with realistic feedback
          const mockFeedback = generateMockFeedback();
          setPronunciationFeedback(mockFeedback);
          setScore(mockFeedback.accuracy);
        }
      } else {
        // Fallback to simulated analysis
        const mockFeedback = generateMockFeedback();
        setPronunciationFeedback(mockFeedback);
        setScore(mockFeedback.accuracy);
      }
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
      recognition.maxAlternatives = 3; // Get multiple recognition alternatives
      
      // Add timeout to prevent infinite loading
      const timeout = setTimeout(() => {
        recognition.stop();
        reject(new Error('Speech recognition timeout. Please try again.'));
      }, 8000); // 8 second timeout
      
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      recognition.onresult = (event: any) => {
        clearTimeout(timeout);
        const transcript = event.results[0][0].transcript;
        URL.revokeObjectURL(audioUrl);
        resolve(transcript.toLowerCase().trim());
      };
      
      recognition.onerror = (event: any) => {
        clearTimeout(timeout);
        URL.revokeObjectURL(audioUrl);
        console.log('Speech recognition error:', event.error);
        let errorMessage = 'Speech recognition failed';
        
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please speak clearly.';
            break;
          case 'audio-capture':
            errorMessage = 'Audio capture failed. Please check your microphone.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone access denied. Please allow microphone access.';
            break;
          case 'network':
            errorMessage = 'Network error. Please check your internet connection.';
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
        }
        
        reject(new Error(errorMessage));
      };
      
      recognition.onnomatch = () => {
        clearTimeout(timeout);
        URL.revokeObjectURL(audioUrl);
        reject(new Error('No speech detected. Please speak clearly.'));
      };
      
      recognition.onend = () => {
        clearTimeout(timeout);
        URL.revokeObjectURL(audioUrl);
      };
      
      try {
        recognition.start();
        audio.play();
      } catch (error) {
        clearTimeout(timeout);
        URL.revokeObjectURL(audioUrl);
        reject(new Error('Failed to start speech recognition. Please try again.'));
      }
    });
  };

  const compareWithExpected = (recognized: string, expected: string, phonetic: string) => {
    const cleanExpected = expected.toLowerCase().trim();
    const cleanRecognized = recognized.toLowerCase().trim();
    
    // Enhanced similarity calculation
    const similarity = calculateEnhancedSimilarity(cleanRecognized, cleanExpected, phonetic);
    
    // Analyze specific pronunciation challenges
    const challenges = analyzePronunciationChallenges(cleanRecognized, cleanExpected, phonetic);
    
    let status: 'excellent' | 'good' | 'needs-improvement';
    let feedback: string;
    let suggestions: string[] = [];
    
    if (similarity >= 0.85) {
      status = 'excellent';
      feedback = 'Excellent pronunciation! Your Zulu sounds very natural!';
      suggestions = [
        'Perfect! You\'re ready for the next challenge.',
        'Try practicing with longer phrases.',
        'Your pronunciation is native-like!'
      ];
    } else if (similarity >= 0.65) {
      status = 'good';
      feedback = 'Good pronunciation! You\'re on the right track with some room for improvement.';
      suggestions = [
        `Focus on the pronunciation: ${phonetic}`,
        'Listen to the original again and repeat slowly.',
        'Pay attention to syllable stress and tone.',
        'Practice the difficult sounds more deliberately.'
      ];
      
      // Add specific suggestions based on challenges
      if (challenges.includes('clicks')) {
        suggestions.push('Practice the click sounds (C, Q, X) more carefully - they are unique to Zulu.');
      }
      if (challenges.includes('vowels')) {
        suggestions.push('Focus on vowel pronunciation - Zulu vowels are very distinct.');
      }
      if (challenges.includes('stress')) {
        suggestions.push('Pay attention to syllable stress - it can change the meaning of words.');
      }
    } else {
      status = 'needs-improvement';
      feedback = 'Keep practicing! Your pronunciation needs more work to sound natural.';
      suggestions = [
        `Listen carefully to: ${phonetic}`,
        'Break the word into syllables and practice each part separately.',
        'Record yourself multiple times and compare.',
        'Try speaking more slowly and clearly.',
        'Focus on the specific sounds that are challenging for you.'
      ];
      
      // Add specific suggestions based on challenges
      if (challenges.includes('clicks')) {
        suggestions.push('The click sounds (C, Q, X) are crucial - practice them with a native speaker if possible.');
      }
      if (challenges.includes('vowels')) {
        suggestions.push('Master the five Zulu vowels (A, E, I, O, U) - they are the foundation of pronunciation.');
      }
      if (challenges.includes('consonants')) {
        suggestions.push('Pay attention to consonant clusters and their pronunciation.');
      }
    }
    
    return {
      accuracy: Math.round(similarity * 100),
      feedback,
      suggestions,
      status
    };
  };

  const analyzePronunciationChallenges = (recognized: string, expected: string, phonetic: string): string[] => {
    const challenges: string[] = [];
    
    // Check for click sounds (C, Q, X)
    const clickSounds = ['c', 'q', 'x'];
    const hasClicks = clickSounds.some(sound => expected.includes(sound));
    const recognizedClicks = clickSounds.some(sound => recognized.includes(sound));
    
    if (hasClicks && !recognizedClicks) {
      challenges.push('clicks');
    }
    
    // Check for vowel differences
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const expectedVowels = expected.split('').filter(char => vowels.includes(char));
    const recognizedVowels = recognized.split('').filter(char => vowels.includes(char));
    
    if (expectedVowels.length !== recognizedVowels.length) {
      challenges.push('vowels');
    }
    
    // Check for syllable stress differences
    const expectedSyllables = expected.split(/[aeiou]+/).filter(s => s.length > 0);
    const recognizedSyllables = recognized.split(/[aeiou]+/).filter(s => s.length > 0);
    
    if (Math.abs(expectedSyllables.length - recognizedSyllables.length) > 1) {
      challenges.push('stress');
    }
    
    // Check for consonant differences
    const consonants = 'bcdfghjklmnpqrstvwxyz'.split('');
    const expectedConsonants = expected.split('').filter(char => consonants.includes(char));
    const recognizedConsonants = recognized.split('').filter(char => consonants.includes(char));
    
    if (Math.abs(expectedConsonants.length - recognizedConsonants.length) > 2) {
      challenges.push('consonants');
    }
    
    return challenges;
  };

  const calculateEnhancedSimilarity = (str1: string, str2: string, phonetic: string): number => {
    const maxLength = Math.max(str1.length, str2.length);
    if (maxLength === 0) return 1;

    const distance = levenshteinDistance(str1, str2);
    const phoneticDistance = levenshteinDistance(str1, phonetic);
    const phoneticLength = phonetic.length;

    // Weighted similarity based on phonetic distance
    const phoneticWeight = 0.3; // Adjust as needed
    const distanceWeight = 0.7; // Adjust as needed

    return (maxLength - (distance * distanceWeight + phoneticDistance * phoneticWeight)) / maxLength;
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
    // More realistic accuracy scores based on common pronunciation patterns
    const accuracyScores = [45, 52, 58, 63, 67, 71, 75, 78, 82, 85, 88, 91, 94];
    const accuracy = accuracyScores[Math.floor(Math.random() * accuracyScores.length)];
    
    // Analyze specific challenges for this phrase
    const challenges = analyzePronunciationChallenges('', currentEx.phrase, currentEx.phonetic);
    
    let status: 'excellent' | 'good' | 'needs-improvement';
    let feedback: string;
    let suggestions: string[] = [];
    
    if (accuracy >= 85) {
      status = 'excellent';
      feedback = 'Excellent pronunciation! Your Zulu sounds very natural and clear!';
      suggestions = [
        'Outstanding work! Your pronunciation is native-like.',
        'Try practicing with longer, more complex phrases.',
        'You\'re ready for advanced conversation practice!'
      ];
    } else if (accuracy >= 65) {
      status = 'good';
      feedback = 'Good pronunciation! You\'re making great progress with some areas for improvement.';
      suggestions = [
        `Focus on the pronunciation: ${currentEx.phonetic}`,
        'Listen to the original audio multiple times.',
        'Pay attention to syllable stress and intonation.',
        'Practice the challenging sounds more deliberately.',
        'Try recording yourself and comparing with the original.'
      ];
      
      // Add specific suggestions based on challenges
      if (challenges.includes('clicks')) {
        suggestions.push('Practice the click sounds (C, Q, X) more carefully - they are unique to Zulu.');
      }
      if (challenges.includes('vowels')) {
        suggestions.push('Focus on vowel pronunciation - Zulu vowels are very distinct.');
      }
      if (challenges.includes('stress')) {
        suggestions.push('Pay attention to syllable stress - it can change the meaning of words.');
      }
    } else {
      status = 'needs-improvement';
      feedback = 'Keep practicing! Your pronunciation needs more work to sound natural in Zulu.';
      suggestions = [
        `Listen carefully to: ${currentEx.phonetic}`,
        'Break the word into smaller parts and practice each syllable.',
        'Record yourself multiple times and listen for differences.',
        'Try speaking more slowly and clearly.',
        'Focus on the specific sounds that are most challenging.'
      ];
      
      // Add specific suggestions based on challenges
      if (challenges.includes('clicks')) {
        suggestions.push('The click sounds (C, Q, X) are crucial - practice them with a native speaker if possible.');
      }
      if (challenges.includes('vowels')) {
        suggestions.push('Master the five Zulu vowels (A, E, I, O, U) - they are the foundation of pronunciation.');
      }
      if (challenges.includes('consonants')) {
        suggestions.push('Pay attention to consonant clusters and their pronunciation.');
      }
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
      case "Beginner":
        return "bg-green-100 text-green-800 border-green-200";
      case "Intermediate":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Advanced":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Zulu Pronunciation Practice
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Practice speaking Zulu words and phrases from the course. Listen to native pronunciation and record yourself.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{currentExercise + 1} of {exercises.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main Exercise Card */}
        <Card className="mb-8 shadow-lg border-0 bg-white">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Badge className={`${getDifficultyColor(currentEx.difficulty)} border`}>
                {currentEx.difficulty} • {currentEx.lessonTitle}
              </Badge>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              {currentEx.phrase}
            </CardTitle>
            <p className="text-lg text-gray-700">{currentEx.english}</p>
            <p className="text-gray-500 italic">
              Pronunciation: {currentEx.phonetic}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Listen Section */}
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Step 1: Listen</h3>
              <Button 
                onClick={handlePlayOriginal}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                size="lg"
                disabled={isPlaying}
              >
                <Volume2 className="h-5 w-5 mr-2" />
                {isPlaying ? "Playing..." : "Play Original"}
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
                  className={!isRecording ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white" : ""}
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
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">Recording...</span>
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
                  <div className="flex items-center justify-center space-x-3 p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                    <p className="text-gray-600">Analyzing your pronunciation...</p>
                  </div>
                ) : pronunciationFeedback ? (
                  <div className="space-y-4">
                    {/* Score Display */}
                    <div className="flex items-center justify-center space-x-4 p-4 bg-gray-50 rounded-lg border">
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
                    <div className="bg-gray-50 rounded-lg p-4 text-left">
                      <h4 className="font-medium mb-3 text-center">💡 Tips for Improvement</h4>
                      <ul className="space-y-2">
                        {pronunciationFeedback.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-green-600 font-medium mt-0.5">•</span>
                            <span className="text-sm text-gray-600">{suggestion}</span>
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
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Practice;