import Loader from "@src/components/loader/Loader"
import PlayerInfo from "@src/components/playerInfo/PlayerInfo"
import Question from "@src/components/question/Question"
import Result from "@src/components/result/Result"
import { IUser } from "@src/lib/interfaces/interfaces"
import socket from "@src/socket"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const Client = () => {
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [currentOptions, setCurrentOptions] = useState<string[]>([]);
    const [showResult, setShowResult] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);
    const [leaders, setLeader] = useState<IUser[]>([]);
    const [seconds, setSeconds] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string>('');
    const [infoUser, setInfoUser] = useState<IUser | null>(null);

    const navigate = useNavigate()

    useEffect(() => {
        socket.on('newQuestion', (question) => {
            setCurrentQuestion(question.question);
            setCurrentOptions(question.options);
            setShowResult(false);
            setQuizStarted(true);
            setSelectedAnswer('');
            setSeconds(30);
        });
    
        socket.on('endQuiz', (leaderboard) => {
            setShowResult(true);
            setLeader(leaderboard);
            setSelectedAnswer('');
            setQuizStarted(false);
            socket.emit('requestUserStats', socket.id);
        });
    
        socket.on('resetQuiz', () => {
            navigate('#')
        })

        socket.on('userStats', (user) => {
            setInfoUser(user);
        })

        return () => {
            socket.off('newQuestion');
            socket.off('endQuiz');
            socket.off('resetQuiz');
            socket.off('userStats');
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
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100%',
                padding: '0px 15px',
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
            {(showResult && infoUser) &&
                <>
                    <PlayerInfo
                        user={infoUser}
                    />
                    <Result
                        data={leaders}
                    />
                </>
            }
        </section>
    );
}

export default Client;
