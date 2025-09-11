import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface LessonProgress {
  lessonId: string;
  completed: boolean;
  completedAt?: string;
  score?: number;
  timeSpent?: number; // in minutes
}

interface ModuleProgress {
  moduleId: string;
  lessonsCompleted: number;
  totalLessons: number;
  completed: boolean;
  completedAt?: string;
}

interface UserProgress {
  userEmail: string; // Use email as the primary identifier
  userId: string; // Keep for backward compatibility
  lessonsCompleted: number;
  totalLessons: number;
  studyTime: number; // in hours
  averageScore: number;
  currentStreak: number;
  badgesEarned: string[];
  currentLevel: string;
  lastActivityDate: string;
  lessonProgress: LessonProgress[];
  moduleProgress: ModuleProgress[];
}

interface UserProgressContextType {
  userProgress: UserProgress | null;
  isLoading: boolean;
  markLessonComplete: (lessonId: string, score?: number, timeSpent?: number) => void;
  updateStudyTime: (minutes: number) => void;
  updateStreak: () => void;
  addBadge: (badgeId: string) => void;
  getModuleProgress: (moduleId: string) => ModuleProgress | null;
  getLessonProgress: (lessonId: string) => LessonProgress | null;
  exportProgress: () => string | null;
  importProgress: (progressData: string) => boolean;
  clearAllProgress: () => void;
  forceReloadProgress: () => void;
}

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

export const useUserProgress = () => {
  const context = useContext(UserProgressContext);
  if (context === undefined) {
    throw new Error('useUserProgress must be used within a UserProgressProvider');
  }
  return context;
};

interface UserProgressProviderProps {
  children: ReactNode;
}

// Mock lesson data structure - in a real app, this would come from your backend
const LESSON_DATA = {
  modules: [
    {
      id: 'pronunciation-fundamentals',
      title: 'Pronunciation Fundamentals',
      lessons: [
        { id: 'lesson-1', title: 'Basic Sounds' },
        { id: 'lesson-2', title: 'Vowel Pronunciation' },
        { id: 'lesson-3', title: 'Consonant Clusters' },
        { id: 'lesson-4', title: 'Tone and Stress' },
        { id: 'lesson-5', title: 'Common Mistakes' }
      ]
    },
    {
      id: 'basic-greetings',
      title: 'Basic Greetings & Introductions',
      lessons: [
        { id: 'lesson-6', title: 'Hello and Goodbye' },
        { id: 'lesson-7', title: 'Introducing Yourself' },
        { id: 'lesson-8', title: 'Asking Names' },
        { id: 'lesson-9', title: 'Polite Expressions' }
      ]
    },
    {
      id: 'numbers-counting',
      title: 'Numbers & Counting',
      lessons: [
        { id: 'lesson-10', title: 'Numbers 1-10' },
        { id: 'lesson-11', title: 'Numbers 11-20' },
        { id: 'lesson-12', title: 'Counting Objects' }
      ]
    },
    {
      id: 'advanced-greetings',
      title: 'Advanced Greetings',
      lessons: [
        { id: 'lesson-13', title: 'Time-based Greetings' },
        { id: 'lesson-14', title: 'Formal vs Informal' },
        { id: 'lesson-15', title: 'Cultural Context' },
        { id: 'lesson-16', title: 'Regional Variations' }
      ]
    },
    {
      id: 'family-relationships',
      title: 'Family & Relationships',
      lessons: [
        { id: 'lesson-17', title: 'Family Members' },
        { id: 'lesson-18', title: 'Describing Relationships' },
        { id: 'lesson-19', title: 'Family Activities' }
      ]
    },
    {
      id: 'daily-conversations',
      title: 'Daily Conversations',
      lessons: [
        { id: 'lesson-20', title: 'At Home' },
        { id: 'lesson-21', title: 'At Work' },
        { id: 'lesson-22', title: 'Shopping' },
        { id: 'lesson-23', title: 'Transportation' }
      ]
    }
  ]
};

const TOTAL_LESSONS = LESSON_DATA.modules.reduce((total, module) => total + module.lessons.length, 0);

export const UserProgressProvider: React.FC<UserProgressProviderProps> = ({ children }) => {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Initialize or load user progress
  useEffect(() => {
    if (user) {
      loadUserProgress();
    } else {
      setUserProgress(null);
      setIsLoading(false);
    }
  }, [user]);

  const loadUserProgress = async () => {
    try {
      setIsLoading(true);
      
      if (!user) {
        console.log('❌ No user found, cannot load progress');
        return;
      }
      
      console.log('🔄 Loading progress for user:', user.email, 'ID:', user.id);
      
      // Use email as the key for consistent progress across sessions
      const progressKey = `zulu_progress_${user.email.toLowerCase()}`;
      const oldProgressKey = `zulu_progress_${user.id}`; // For migration from old system
      
      console.log('🔍 Looking for progress with key:', progressKey);
      console.log('🔍 Also checking old key:', oldProgressKey);
      
      let storedProgress = localStorage.getItem(progressKey);
      
      // If no progress found with email key, check for old ID-based key (migration)
      if (!storedProgress) {
        console.log('📭 No progress found with email key, checking old key...');
        const oldProgress = localStorage.getItem(oldProgressKey);
        if (oldProgress) {
          console.log('🔄 Found old progress, migrating...');
          // Migrate old progress to new email-based system
          const parsedOldProgress = JSON.parse(oldProgress);
          const migratedProgress = {
            ...parsedOldProgress,
            userEmail: user.email,
            userId: user.id
          };
          localStorage.setItem(progressKey, JSON.stringify(migratedProgress));
          localStorage.removeItem(oldProgressKey); // Clean up old key
          storedProgress = JSON.stringify(migratedProgress);
          console.log('✅ Progress migrated successfully');
        } else {
          console.log('📭 No old progress found either');
        }
      } else {
        console.log('✅ Found existing progress with email key');
      }
      
      if (storedProgress) {
        console.log('📖 Loading existing progress...');
        const parsedProgress = JSON.parse(storedProgress);
        // Update the progress with current user info
        const updatedProgress = {
          ...parsedProgress,
          userEmail: user.email,
          userId: user.id
        };
        setUserProgress(updatedProgress);
        // Save the updated progress
        localStorage.setItem(progressKey, JSON.stringify(updatedProgress));
        // Clean up any old progress data
        cleanupOldProgress();
        console.log('✅ Progress loaded successfully:', updatedProgress.lessonsCompleted, 'lessons completed');
      } else {
        console.log('🆕 Creating new progress for user...');
        // Initialize new user with empty progress
        const newProgress: UserProgress = {
          userEmail: user.email,
          userId: user.id,
          lessonsCompleted: 0,
          totalLessons: TOTAL_LESSONS,
          studyTime: 0,
          averageScore: 0,
          currentStreak: 0,
          badgesEarned: [],
          currentLevel: 'Beginner',
          lastActivityDate: new Date().toISOString(),
          lessonProgress: [],
          moduleProgress: LESSON_DATA.modules.map(module => ({
            moduleId: module.id,
            lessonsCompleted: 0,
            totalLessons: module.lessons.length,
            completed: false
          }))
        };
        
        setUserProgress(newProgress);
        localStorage.setItem(progressKey, JSON.stringify(newProgress));
        console.log('✅ New progress created for user');
      }
    } catch (error) {
      console.error('Failed to load user progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserProgress = (progress: UserProgress) => {
    if (!user) return;
    const progressKey = `zulu_progress_${user.email.toLowerCase()}`;
    localStorage.setItem(progressKey, JSON.stringify(progress));
    console.log('💾 Progress saved for user:', user.email);
  };

  // Clean up old progress data (for maintenance)
  const cleanupOldProgress = () => {
    if (!user) return;
    const oldProgressKey = `zulu_progress_${user.id}`;
    const oldProgress = localStorage.getItem(oldProgressKey);
    if (oldProgress) {
      localStorage.removeItem(oldProgressKey);
      console.log('🧹 Cleaned up old progress data for user:', user.email);
    }
  };

  const markLessonComplete = (lessonId: string, score: number = 85, timeSpent: number = 15) => {
    if (!userProgress) return;

    const updatedProgress = { ...userProgress };
    
    // Update lesson progress
    const existingLessonIndex = updatedProgress.lessonProgress.findIndex(
      lesson => lesson.lessonId === lessonId
    );
    
    if (existingLessonIndex >= 0) {
      // Update existing lesson
      updatedProgress.lessonProgress[existingLessonIndex] = {
        ...updatedProgress.lessonProgress[existingLessonIndex],
        completed: true,
        completedAt: new Date().toISOString(),
        score,
        timeSpent
      };
    } else {
      // Add new lesson
      updatedProgress.lessonProgress.push({
        lessonId,
        completed: true,
        completedAt: new Date().toISOString(),
        score,
        timeSpent
      });
    }

    // Update module progress
    const module = LESSON_DATA.modules.find(m => 
      m.lessons.some(l => l.id === lessonId)
    );
    
    if (module) {
      const moduleIndex = updatedProgress.moduleProgress.findIndex(
        mp => mp.moduleId === module.id
      );
      
      if (moduleIndex >= 0) {
        const completedLessonsInModule = updatedProgress.lessonProgress.filter(
          lp => lp.completed && module.lessons.some(l => l.id === lp.lessonId)
        ).length;
        
        updatedProgress.moduleProgress[moduleIndex] = {
          ...updatedProgress.moduleProgress[moduleIndex],
          lessonsCompleted: completedLessonsInModule,
          completed: completedLessonsInModule === module.lessons.length,
          completedAt: completedLessonsInModule === module.lessons.length 
            ? new Date().toISOString() 
            : undefined
        };
      }
    }

    // Update overall stats
    updatedProgress.lessonsCompleted = updatedProgress.lessonProgress.filter(lp => lp.completed).length;
    updatedProgress.studyTime += timeSpent / 60; // Convert minutes to hours
    
    // Calculate average score
    const completedLessons = updatedProgress.lessonProgress.filter(lp => lp.completed);
    if (completedLessons.length > 0) {
      updatedProgress.averageScore = Math.round(
        completedLessons.reduce((sum, lesson) => sum + (lesson.score || 0), 0) / completedLessons.length
      );
    }

    // Update level based on progress
    const completionPercentage = (updatedProgress.lessonsCompleted / updatedProgress.totalLessons) * 100;
    if (completionPercentage >= 80) {
      updatedProgress.currentLevel = 'Advanced';
    } else if (completionPercentage >= 50) {
      updatedProgress.currentLevel = 'Intermediate';
    } else {
      updatedProgress.currentLevel = 'Beginner';
    }

    updatedProgress.lastActivityDate = new Date().toISOString();

    setUserProgress(updatedProgress);
    saveUserProgress(updatedProgress);
  };

  const updateStudyTime = (minutes: number) => {
    if (!userProgress) return;

    const updatedProgress = {
      ...userProgress,
      studyTime: userProgress.studyTime + (minutes / 60),
      lastActivityDate: new Date().toISOString()
    };

    setUserProgress(updatedProgress);
    saveUserProgress(updatedProgress);
  };

  const updateStreak = () => {
    if (!userProgress) return;

    const today = new Date().toDateString();
    const lastActivity = new Date(userProgress.lastActivityDate).toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

    let newStreak = userProgress.currentStreak;

    if (lastActivity === today) {
      // Already updated today, no change
    } else if (lastActivity === yesterday) {
      // Continuing streak
      newStreak += 1;
    } else {
      // Streak broken
      newStreak = 1;
    }

    const updatedProgress = {
      ...userProgress,
      currentStreak: newStreak,
      lastActivityDate: new Date().toISOString()
    };

    setUserProgress(updatedProgress);
    saveUserProgress(updatedProgress);
  };

  const addBadge = (badgeId: string) => {
    if (!userProgress || userProgress.badgesEarned.includes(badgeId)) return;

    const updatedProgress = {
      ...userProgress,
      badgesEarned: [...userProgress.badgesEarned, badgeId]
    };

    setUserProgress(updatedProgress);
    saveUserProgress(updatedProgress);
  };

  const getModuleProgress = (moduleId: string): ModuleProgress | null => {
    if (!userProgress) return null;
    return userProgress.moduleProgress.find(mp => mp.moduleId === moduleId) || null;
  };

  const getLessonProgress = (lessonId: string): LessonProgress | null => {
    if (!userProgress) return null;
    return userProgress.lessonProgress.find(lp => lp.lessonId === lessonId) || null;
  };

  const exportProgress = (): string | null => {
    if (!userProgress) return null;
    return JSON.stringify(userProgress, null, 2);
  };

  const importProgress = (progressData: string): boolean => {
    try {
      if (!user) return false;
      
      const importedProgress = JSON.parse(progressData) as UserProgress;
      
      // Validate the imported data
      if (!importedProgress.userEmail || !importedProgress.lessonProgress || !importedProgress.moduleProgress) {
        return false;
      }
      
      // Update with current user info
      const updatedProgress = {
        ...importedProgress,
        userEmail: user.email,
        userId: user.id
      };
      
      setUserProgress(updatedProgress);
      saveUserProgress(updatedProgress);
      
      console.log('📥 Progress imported for user:', user.email);
      return true;
    } catch (error) {
      console.error('Failed to import progress:', error);
      return false;
    }
  };

  // Debug function to clear all progress data (for testing)
  const clearAllProgress = () => {
    if (!user) return;
    
    const progressKey = `zulu_progress_${user.email.toLowerCase()}`;
    const oldProgressKey = `zulu_progress_${user.id}`;
    
    localStorage.removeItem(progressKey);
    localStorage.removeItem(oldProgressKey);
    
    console.log('🧹 Cleared all progress data for user:', user.email);
    
    // Reload progress
    loadUserProgress();
  };

  // Debug function to force reload progress
  const forceReloadProgress = () => {
    if (!user) return;
    
    console.log('🔄 FORCE RELOADING PROGRESS...');
    console.log('Current user:', user);
    console.log('Current userProgress:', userProgress);
    
    loadUserProgress();
  };

  const value: UserProgressContextType = {
    userProgress,
    isLoading,
    markLessonComplete,
    updateStudyTime,
    updateStreak,
    addBadge,
    getModuleProgress,
    getLessonProgress,
    exportProgress,
    importProgress,
    clearAllProgress,
    forceReloadProgress,
  };

  return (
    <UserProgressContext.Provider value={value}>
      {children}
    </UserProgressContext.Provider>
  );
};
