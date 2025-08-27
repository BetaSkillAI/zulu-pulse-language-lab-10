import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, RotateCcw, Trophy, Star } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface LessonQuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number, total: number) => void;
}

const LessonQuiz = ({ questions, onComplete }: LessonQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
      onComplete(score + (selectedAnswer === questions[currentQuestion].correctAnswer ? 1 : 0), questions.length);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
  };

  if (showResults) {
    const finalScore = score + (selectedAnswer === questions[currentQuestion].correctAnswer ? 1 : 0);
    const percentage = Math.round((finalScore / questions.length) * 100);
    
    return (
      <Card className="w-full max-w-2xl mx-auto bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-gray-900">
            Quiz Complete! 🎉
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="relative">
                          <div className="text-6xl font-bold text-green-600">
              {percentage}%
            </div>
            <div className="absolute -top-4 -right-4">
              {percentage >= 80 ? (
                <Trophy className="h-10 w-10 text-yellow-500" />
              ) : percentage >= 60 ? (
                <Star className="h-10 w-10 text-blue-500" />
              ) : (
                <Star className="h-10 w-10 text-green-500" />
              )}
            </div>
          </div>
          <p className="text-lg text-gray-700">
            You got {finalScore} out of {questions.length} questions correct!
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={handleRetry} 
              variant="outline"
              className="text-gray-600 hover:text-gray-900"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button 
              onClick={() => setShowResults(false)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Continue Learning
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const question = questions[currentQuestion];

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-gray-900">Lesson Quiz</CardTitle>
                      <Badge className="bg-green-100 text-green-800 border-green-200 font-medium">
            Question {currentQuestion + 1} of {questions.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900">{question.question}</h3>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === index ? "default" : "outline"}
                className={`w-full justify-start h-auto p-4 ${
                  isAnswered
                    ? index === question.correctAnswer
                      ? "bg-green-50 border-green-500 text-green-800"
                      : selectedAnswer === index
                      ? "bg-red-50 border-red-500 text-red-800"
                      : "text-gray-600 hover:text-gray-900"
                    : selectedAnswer === index
                    ? "bg-green-600 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => handleAnswerSelect(index)}
                disabled={isAnswered}
              >
                <div className="flex items-center w-full">
                  <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                  <span className="text-left">{option}</span>
                  {isAnswered && (
                    <div className="ml-auto">
                      {index === question.correctAnswer ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : selectedAnswer === index ? (
                        <XCircle className="h-5 w-5 text-red-600" />
                      ) : null}
                    </div>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </div>

        {isAnswered && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="font-semibold mb-2 text-gray-900">Explanation:</p>
            <p className="text-sm text-gray-700">{question.explanation}</p>
          </div>
        )}

        <div className="flex justify-between">
          {!isAnswered ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className="ml-auto bg-green-600 hover:bg-green-700 text-white"
            >
              Submit Answer
            </Button>
          ) : (
            <Button 
              onClick={handleNextQuestion} 
              className="ml-auto bg-green-600 hover:bg-green-700 text-white"
            >
              {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonQuiz;
