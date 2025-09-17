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
  const [karaokeActive, setKaraokeActive] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentLineRef = useRef<number>(0);
  const { toast } = useToast();

  const songs = [
    {
      id: 1,
      title: "Jerusalema",
      artist: "Master KG feat. Nomcebo",
      duration: "5:30",
      difficulty: "Intermediate",
      audio: "/Voices/Master KG - Jerusalema [Feat (mp3cut.net) (1).mp3",
      zuluLyrics: [
        "Jerusalema ikhaya lami",
        "Ngilondoloze",
        "Uhambe nami",
        "Zungangishiyi lana",
        "Jerusalema ikhaya lami",
        "Ngilondoloze",
        "Uhambe nami",
        "Zungangishiyi lana",
        "Ndawo yami ayikho lana",
        "Mbuso wami awukho lana",
        "Ngilondoloze",
        "Zuhambe nami",
        "Ndawo yami ayikho lana",
        "Mbuso wami awukho lana",
        "Ngilondoloze",
        "Zuhambe nami",
        "Ngilondoloze",
        "Ngilondoloze",
        "Ngilondoloze",
        "Zungangishiyi lana",
        "Ngilondoloze",
        "Ngilondoloze",
        "Ngilondoloze",
        "Zungangishiyi lana",
        "Ndawo yami ayikho lana",
        "Mbuso wami awukho lana",
        "Ngilondoloze",
        "Zuhambe nami",
        "Ndawo yami ayikho lana",
        "Mbuso wami awukho lana",
        "Ngilondoloze",
        "Zuhambe nami",

      ],
      englishTranslation: [
        "Jerusalem is my home",
        "Save me",
        "Walk with me",
        "Don't leave me here",
        "Jerusalem is my home",
        "Save me",
        "Walk with me",
        "Don't leave me here",
        "My place is not here",
        "My kingdom is not here",
        "Save me",
        "Walk with me",
        "My place is not here",
        "My kingdom is not here",
        "Save me",
        "Walk with me",
        "Save me",
        "Save me",
        "Save me",
        "Don't leave me here",
        "Save me",
        "Save me",
        "Save me",
        "Don't leave me here",
        "My place is not here",
        "My kingdom is not here",
        "Save me",
        "Walk with me",
        "My place is not here",
        "My kingdom is not here",
        "Save me",
        "Walk with me",

      ]
    },
    {
      id: 2,
      title: "Ulithemba Lami",
      artist: "Joyous Celebration",
      duration: "5:30",
      difficulty: "Intermediate",
      audio: "/audio/ulithemba-lami.mp3",
      zuluLyrics: [
        "Uthando lwakho lujulile",
        "Lususa ukwesaba ah",
        "Alujiki lumi njalo",
        "Lususa I- Izono",
        "Uthando lwakho lujulile",
        "Lususa ukwesaba ah",
        "Alujiki lumi njalo",
        "Lisusa I- Izono",
        "Sohlala kuwe (sohlala kuwe)",
        "Sohlala kuwe (nsuku zonke)",
        "Thina (singabantwana bakho)",
        "Wena wedwa (ufanelwe ukubongwa uyiNkosi yethu)",
        "Sohlala kuwe (sohlala kuwe)",
        "Sohlala kuwe (nsuku zonke)",
        "Singabantwana (singabantwana bakho) hallelujah",
        "Umusa wakho awuphezi uyasivikela ah"
      ],
      englishTranslation: [
        "Your love is deep",
        "It takes away fear, ah",
        "It does not change, it stands firm",
        "It removes sins",
        "Your love is deep",
        "It takes away fear, ah",
        "It does not change, it stands firm",
        "It removes sins",
        "We will dwell in You (we will dwell in You)",
        "We will dwell in You (every day)",
        "We (are Your children)",
        "You alone (deserve all the praise, You are our Lord)",
        "We will dwell in You (we will dwell in You)",
        "We will dwell in You (every day)",
        "We are children (we are Your children) Hallelujah",
        "Your mercy never ends, it protects us, ah"
      ]
    },
    {
      id: 3,
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
      id: 4,
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
      id: 5,
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

  // Karaoke progression effect
  useEffect(() => {
    if (!karaokeActive || (currentPlaying !== 1 && currentPlaying !== 2)) return;

    // Use different intervals for different songs
    const intervalMs = currentPlaying === 1 ? 4000 : 3000; // 4 seconds for Jerusalema, 3 seconds for Ulithemba Lami

    console.log(`🎵 Starting karaoke progression (${intervalMs / 1000}s intervals)`);
    const interval = setInterval(() => {
      setCurrentLine(prev => {
        const songIndex = currentPlaying === 1 ? 0 : 1; // Jerusalema or Ulithemba Lami
        const totalLines = songs[songIndex].zuluLyrics.length;
        const next = prev + 1;

        // For Jerusalema, go through all lines from first to last
        if (currentPlaying === 1) {
          if (next >= totalLines) {
            console.log(`🎵 Karaoke: Reached end of Jerusalema at line ${prev}`);
            return prev; // Stay at the last line
          }
          console.log(`🎵 Karaoke: Line ${next} - "${songs[songIndex].zuluLyrics[next]}"`);
          return next;
        } else {
          // For Ulithemba Lami, cycle through lines
          const cycledNext = next % totalLines;
          console.log(`🎵 Karaoke: Line ${cycledNext} - "${songs[songIndex].zuluLyrics[cycledNext]}"`);
          return cycledNext;
        }
      });
    }, intervalMs);

    return () => {
      console.log('🎵 Stopping karaoke progression');
      clearInterval(interval);
    };
  }, [karaokeActive, currentPlaying]);

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
          audioRef.current = null;
        }
        setCurrentPlaying(null);
        setCurrentLine(0);
        currentLineRef.current = 0;
        console.log('🎵 Audio stopped manually');
      } else {
        // Stop any currently playing audio
        if (audioRef.current) {
          audioRef.current.pause();
        }

        // Use actual audio for Jerusalema (id: 1) and Ulithemba Lami (id: 2), mock audio for others
        if (songId === 1 || songId === 2) {
          // Use actual audio file for Jerusalema or Ulithemba Lami
          const audio = new Audio(song.audio);
          audioRef.current = audio;

          console.log('🎵 Attempting to load audio:', song.audio);

          // Vocal detection setup
          let audioContext: AudioContext;
          let analyser: AnalyserNode;
          let source: MediaElementAudioSourceNode;
          let vocalDetectionActive = false;

          // Custom timing for songs - synchronized with actual vocals
          const vocalTiming = songId === 1 ? [
            // Jerusalema timing - 4 seconds per line for all 33 lines
            0, 4000, 8000, 12000, 16000, 20000, 24000, 28000, 32000, 36000, 40000, 44000, 48000, 52000, 56000, 60000,
            64000, 68000, 72000, 76000, 80000, 84000, 88000, 92000, 96000, 100000, 104000, 108000, 112000, 116000, 120000, 124000, 128000
          ] : [
            // Ulithemba Lami timing
            0, 7000, 14000, 21000, 28000, 35000, 42000, 49000, 56000, 63000, 70000, 77000, 84000, 91000, 98000, 105000
          ];

          const startVocalDetection = () => {
            try {
              audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
              analyser = audioContext.createAnalyser();
              source = audioContext.createMediaElementSource(audio);

              source.connect(analyser);
              analyser.connect(audioContext.destination);

              analyser.fftSize = 2048;
              const bufferLength = analyser.frequencyBinCount;
              const dataArray = new Uint8Array(bufferLength);

              vocalDetectionActive = true;
              console.log('🎵 Vocal detection started');

              const detectVocals = () => {
                if (!vocalDetectionActive) return;

                analyser.getByteFrequencyData(dataArray);

                // Analyze vocal frequencies (typically 85Hz - 255Hz for human voice)
                let vocalEnergy = 0;
                for (let i = 0; i < bufferLength; i++) {
                  const frequency = i * audioContext.sampleRate / analyser.fftSize;
                  if (frequency >= 85 && frequency <= 255) {
                    vocalEnergy += dataArray[i];
                  }
                }

                const averageVocalEnergy = vocalEnergy / (bufferLength * 0.1); // Normalize

                // Get current audio time
                const currentTime = audio.currentTime * 1000; // Convert to milliseconds

                // Find which line should be highlighted based on vocal timing
                let currentLineIndex = 0;
                for (let i = 0; i < vocalTiming.length; i++) {
                  const nextTime = vocalTiming[i + 1] || Infinity;
                  if (currentTime >= vocalTiming[i] && currentTime < nextTime) {
                    currentLineIndex = i;
                    break;
                  }
                }

                // Always update line based on timing, but log vocal energy
                if (currentLineIndex !== currentLine) {
                  setCurrentLine(currentLineIndex);
                  const songIndex = songId === 1 ? 0 : 1;
                  console.log(`🎵 VOCAL: Line ${currentLineIndex} at ${currentTime}ms - "${songs[songIndex].zuluLyrics[currentLineIndex]}" (Energy: ${averageVocalEnergy.toFixed(1)})`);
                }

                // Log vocal energy every second for debugging
                if (Math.floor(currentTime / 1000) !== Math.floor((currentTime - 16.67) / 1000)) {
                  console.log(`🎵 Vocal Energy: ${averageVocalEnergy.toFixed(1)} at ${(currentTime / 1000).toFixed(1)}s`);
                }

                requestAnimationFrame(detectVocals);
              };

              detectVocals();
            } catch (error) {
              console.error('Vocal detection error:', error);
              // Fallback to simple timing
              startSimpleTiming();
            }
          };

          const startSimpleTiming = () => {
            const timingIntervalMs = songId === 1 ? 4000 : 3000; // 4 seconds for Jerusalema, 3 seconds for Ulithemba Lami
            console.log(`🎵 Using simple timing fallback (${timingIntervalMs / 1000} seconds)`);
            let testLine = 0;
            const songIndex = songId === 1 ? 0 : 1;
            const totalLines = songs[songIndex].zuluLyrics.length;
            const testInterval = setInterval(() => {
              testLine = testLine + 1;

              // For Jerusalema, go through all lines from first to last
              if (songId === 1) {
                if (testLine >= totalLines) {
                  console.log(`🎵 TIMING: Reached end of Jerusalema at line ${testLine - 1}`);
                  return; // Stop the interval
                }
              } else {
                // For Ulithemba Lami, cycle through lines
                testLine = testLine % totalLines;
              }

              setCurrentLine(testLine);
              console.log(`🎵 TIMING: Line ${testLine} - "${songs[songIndex].zuluLyrics[testLine]}"`);
            }, timingIntervalMs);

            (window as any).testInterval = testInterval;
          };

          // Backup timer to ensure lyrics move
          const startBackupTimer = () => {
            const backupIntervalMs = songId === 1 ? 4000 : 7000; // 4 seconds for Jerusalema, 7 seconds for Ulithemba Lami
            console.log(`🎵 Starting backup timer (${backupIntervalMs / 1000} seconds)`);
            let backupLine = 0;
            const songIndex = songId === 1 ? 0 : 1;
            const totalLines = songs[songIndex].zuluLyrics.length;
            const backupInterval = setInterval(() => {
              backupLine = backupLine + 1;

              // For Jerusalema, go through all lines from first to last
              if (songId === 1) {
                if (backupLine >= totalLines) {
                  console.log(`🎵 BACKUP: Reached end of Jerusalema at line ${backupLine - 1}`);
                  return; // Stop the interval
                }
              } else {
                // For Ulithemba Lami, cycle through lines
                backupLine = backupLine % totalLines;
              }

              setCurrentLine(backupLine);
              console.log(`🎵 BACKUP: Line ${backupLine} - "${songs[songIndex].zuluLyrics[backupLine]}"`);
            }, backupIntervalMs);

            (window as any).backupInterval = backupInterval;
          };

          audio.addEventListener('loadeddata', () => {
            console.log('🎵 Audio loaded successfully, duration:', audio.duration);
            setCurrentPlaying(songId);
            setCurrentLine(0);
            audio.play();

            // Start vocal detection
            startVocalDetection();

            // Start backup timer as safety net
            setTimeout(() => {
              startBackupTimer();
            }, 1000);
          });

          audio.addEventListener('ended', () => {
            console.log('🎵 Song ended');
            vocalDetectionActive = false;
            if ((window as any).testInterval) {
              clearInterval((window as any).testInterval);
            }
            if ((window as any).backupInterval) {
              clearInterval((window as any).backupInterval);
            }
            setCurrentPlaying(null);
            setCurrentLine(0);
          });

          audio.addEventListener('error', (error) => {
            console.error('Audio playback error:', error);
            vocalDetectionActive = false;
            if ((window as any).testInterval) {
              clearInterval((window as any).testInterval);
            }
            if ((window as any).backupInterval) {
              clearInterval((window as any).backupInterval);
            }
            toast({
              title: "Playback Error",
              description: "Could not load audio file.",
              variant: "destructive",
            });
            setCurrentPlaying(null);
            setCurrentLine(0);
          });

          toast({
            title: "Now Playing",
            description: `${song.title} by ${song.artist}`,
          });
        } else {
          // Generate mock audio for other songs
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
                          className={`font-medium text-lg leading-relaxed transition-all duration-500 ease-in-out ${currentPlaying === song.id && currentLine === index
                              ? "text-primary bg-gradient-to-r from-primary/20 to-primary/10 px-4 py-2 rounded-lg shadow-lg scale-105 transform-gpu border-l-4 border-primary animate-pulse"
                              : currentPlaying === song.id
                                ? "text-foreground/60 opacity-70"
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
                          className={`leading-relaxed transition-all duration-300 ${currentPlaying === song.id && currentLine === index
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