import Loader from "@src/components/loader/Loader";
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
    const [seconds, setSeconds] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string>('');

    useEffect(() => {
        socket.on('newQuestion', (question) => {
            setCurrentQuestion(question.question);
            setCurrentOptions(question.options);
            setShowResult(false);
            setQuizStarted(true);
            setSelectedAnswer('');
            setSeconds(30);
        });
    
        socket.on('endQuiz', (leaders) => {
            setShowResult(true);
            setLeader(leaders);
            setSelectedAnswer('');
            setQuizStarted(false);
        });
    
        return () => {
            socket.off('newQuestion');
            socket.off('endQuiz');
        };
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (quizStarted) {
            interval = setInterval(() => {
                if (seconds > 0) {
                    setSeconds(prevSeconds => prevSeconds - 1);
                } else {
                    clearInterval(interval);
                    handleTimeout();
                }
            }, 1000);
        }
    
        return () => clearInterval(interval);
    }, [quizStarted, seconds]);

    const handleAnswer = (selectedAnswer: string) => {
        setSelectedAnswer(selectedAnswer);
        socket.emit('answer', { answer: selectedAnswer, userId: socket.id });
    };

    const handleTimeout = () => {
        if(selectedAnswer.length > 0) return null;
        setSelectedAnswer('');
        socket.emit('answer', { answer: '', userId: socket.id });
    };
    
    return (
        <section
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100%',
            }}
        >
            {(!quizStarted && !showResult) && (
                <Loader/>
            )}
            {currentQuestion !== '' && !showResult && quizStarted && (
                <Question
                    question={currentQuestion}
                    answers={currentOptions}
                    handleAnswer={handleAnswer}
                    time={seconds}
                    selectedAnswer={selectedAnswer}
                />
            )}
            {showResult &&
                <Result
                    data={leaders}
                />
            }
        </section>
    );
}

export default Client;
