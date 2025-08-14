import { useState, useRef, useEffect } from "react";
import { Play, Pause, Music as MusicIcon, Languages } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const Music = () => {
  // SEO setup
  document.title = "Traditional Zulu Songs & Music - Learn Zulu";
  document.querySelector('meta[name="description"]')?.setAttribute('content', 
    'Learn Zulu through beautiful traditional songs. Listen to native pronunciation, read Zulu lyrics with English translations, and understand cultural context.');
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', 'Traditional Zulu Songs & Music - Learn Zulu');
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', 
    'Learn Zulu through beautiful traditional songs with native pronunciation and cultural context.');
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', '/music');
  const [currentPlaying, setCurrentPlaying] = useState<number | null>(null);
  const [currentLine, setCurrentLine] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const songs = [
    {
      id: 1,
      title: "Shosholoza",
      artist: "Traditional",
      duration: "3:45",
      difficulty: "Beginner",
      audio: "/audio/shosholoza.mp3",
      zuluLyrics: [
        "Shosholoza, kulezo ntaba",
        "Stimela siphume South Africa",
        "Shosholoza, kulezo ntaba",
        "Stimela siphume South Africa"
      ],
      englishTranslation: [
        "Keep going, through those mountains",
        "Train coming from South Africa",
        "Keep going, through those mountains", 
        "Train coming from South Africa"
      ]
    },
    {
      id: 2,
      title: "Senzeni Na?",
      artist: "Traditional Protest Song",
      duration: "4:12",
      difficulty: "Intermediate",
      audio: "/audio/senzeni-na.mp3",
      zuluLyrics: [
        "Senzeni na? Senzeni na?",
        "Sono sethu ubumnyama",
        "Senzeni na? Senzeni na?",
        "Sono sethu yinkulungwane"
      ],
      englishTranslation: [
        "What have we done? What have we done?",
        "Our sin is that we are black",
        "What have we done? What have we done?",
        "Our sin is our blackness"
      ]
    },
    {
      id: 3,
      title: "Nkosi Sikelel' iAfrika",
      artist: "Enoch Sontonga",
      duration: "2:58",
      difficulty: "Advanced",
      audio: "/audio/nkosi-sikelel.mp3",
      zuluLyrics: [
        "Nkosi sikelel' iAfrika",
        "Maluphakanyisw' uphondo lwayo",
        "Yizwa imithandazo yethu",
        "Nkosi sikelela, thina lusapho lwayo"
      ],
      englishTranslation: [
        "Lord bless Africa",
        "May her glory be lifted high",
        "Hear our prayers",
        "Lord bless us, your children"
      ]
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
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

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Generate mock audio using Web Audio API
  const generateMockAudio = (frequency: number, duration: number = 2) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + duration - 0.1);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
    
    return { oscillator, audioContext, duration };
  };

  const handlePlayPause = async (songId: number) => {
    const song = songs.find(s => s.id === songId);
    if (!song) return;

    try {
      if (currentPlaying === songId) {
        // Stop current audio
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setCurrentPlaying(null);
        setCurrentLine(0);
      } else {
        // Stop any currently playing audio
        if (audioRef.current) {
          audioRef.current.pause();
        }
        
        // Generate mock audio based on song ID
        const frequencies = [440, 523, 659]; // A4, C5, E5 notes
        const mockAudio = generateMockAudio(frequencies[songId - 1] || 440, song.zuluLyrics.length * 2);
        
        setCurrentPlaying(songId);
        setCurrentLine(0);
        
        // Karaoke-style highlighting
        const totalDuration = song.zuluLyrics.length * 2000; // 2 seconds per line
        song.zuluLyrics.forEach((_, index) => {
          setTimeout(() => {
            if (currentPlaying === songId) {
              setCurrentLine(index);
            }
          }, index * 2000);
        });
        
        // Auto-stop after duration
        setTimeout(() => {
          setCurrentPlaying(null);
          setCurrentLine(0);
        }, totalDuration);
        
        toast({
          title: "Now Playing",
          description: `${song.title} by ${song.artist} (Mock Audio)`,
        });
      }
    } catch (error) {
      toast({
        title: "Playback Error", 
        description: "Could not generate audio.",
        variant: "destructive",
      });
      setCurrentPlaying(null);
      setCurrentLine(0);
    }
  };

  const handleListenAgain = async (songId: number) => {
    await handlePlayPause(songId);
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Traditional Zulu Songs & Music
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn Zulu through beautiful traditional songs. Listen, read along, and understand the cultural context.
          </p>
        </div>

        <div className="space-y-8">
          {songs.map((song) => (
            <Card key={song.id} className="overflow-hidden hover:shadow-warm transition-all">
              <CardHeader className="bg-gradient-primary text-primary-foreground">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => handlePlayPause(song.id)}
                      className="bg-primary-foreground text-primary hover:bg-primary-foreground/80"
                    >
                      {currentPlaying === song.id ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </Button>
                    <div>
                      <CardTitle className="text-xl">{song.title}</CardTitle>
                      <p className="text-primary-foreground/80">{song.artist}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getDifficultyColor(song.difficulty)}>
                      {song.difficulty}
                    </Badge>
                    <div className="flex items-center text-primary-foreground/80">
                      <MusicIcon className="h-4 w-4 mr-1" />
                      {song.duration}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Zulu Lyrics */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                      <Languages className="h-5 w-5 mr-2 text-primary" />
                      Zulu Lyrics
                    </h3>
                    <div className="space-y-2">
                      {song.zuluLyrics.map((line, index) => (
                        <p 
                          key={index} 
                          className={`font-medium text-lg leading-relaxed transition-all duration-300 ${
                            currentPlaying === song.id && currentLine === index
                              ? "text-primary bg-primary/10 px-2 py-1 rounded-md shadow-sm scale-105"
                              : "text-foreground"
                          }`}
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* English Translation */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                      <Languages className="h-5 w-5 mr-2 text-accent" />
                      English Translation
                    </h3>
                    <div className="space-y-2">
                      {song.englishTranslation.map((line, index) => (
                        <p 
                          key={index} 
                          className={`leading-relaxed transition-all duration-300 ${
                            currentPlaying === song.id && currentLine === index
                              ? "text-accent font-medium bg-accent/10 px-2 py-1 rounded-md"
                              : "text-muted-foreground"
                          }`}
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleListenAgain(song.id)}>
                      <Play className="h-4 w-4 mr-2" />
                      Listen Again
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toast({
                      title: "Practice Mode",
                      description: "Redirecting to practice page...",
                    })}>
                      Practice Pronunciation
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toast({
                      title: "Coming Soon",
                      description: "Song history and cultural context feature coming soon!",
                    })}>
                      Learn More About This Song
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Music;