import Question from "@src/components/question/Question";
import Result from "@src/components/result/Result";
import { IUser } from "@src/lib/interfaces/interfaces";
import socket from "@src/socket";
import { useEffect, useState } from "react";

const Client = () => {
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [currentOptions, setCurrentOptions] = useState<string[]>([]);
    const [showResult, setShowResult] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);
    const [leaders, setLeader] = useState<IUser[]>([]);

    useEffect(() => {
        socket.on('newQuestion', (question) => {
            setCurrentQuestion(question.question);
            setCurrentOptions(question.options);
            setShowResult(false);
            setQuizStarted(true); 
        });
    
        socket.on('endQuiz', (leaders) => {
            setShowResult(true);
            setLeader(leaders)
        });
    
        return () => {
            socket.off('newQuestion');
            socket.off('endQuiz');
        };
    }, []);

    const handleAnswer = (selectedAnswer: string) => {
        socket.emit('answer', selectedAnswer);
    }
    
    return (
        <div>
            {!quizStarted && (
                <p>Опитування ще не розпочалося</p>
            )}
            {currentQuestion !== '' && !showResult && (
                <Question
                    question={currentQuestion}
                    answers={currentOptions}
                    handleAnswer={handleAnswer}
                />
            )}
            {showResult &&
                <Result
                    data={leaders}
                />
            }
        </div>
    );
}

export default Client;
