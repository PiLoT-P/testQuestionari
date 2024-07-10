import QuestionAdmin from "@src/components/questionAdmin/QuestionAdmin";
import Result from "@src/components/result/Result";
import StartEventAdmin from "@src/components/startEventAdmin/StartEventAdmin";
import UsetListAdmin from "@src/components/usersList/UserListAdmin";
import { IUser } from "@src/lib/interfaces/interfaces";
import socket from "@src/socket";
import { useEffect, useState } from "react";

const Admin = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<string>('');
    const [startEvent, setStartEvet] = useState<boolean>(false);
    const [leaders, setLeaders] = useState<IUser[]>([]);

    useEffect(() => {
        socket.on('userList', (userList) => {
            setUsers(userList);
        });

        socket.on('requestUserList', (userList) => {
            setUsers(userList);
        })

        socket.on('newQuestion', (question) => {
            setCurrentQuestion(question.question);
            setStartEvet(true);
        });

        socket.on('endQuiz', (leaders) => {
            setCurrentQuestion('');
            setLeaders(leaders);
            setStartEvet(false);
        });
    
        socket.emit('requestUserList');

        return () => {
            socket.off('userList');
            socket.off('requestUserList');
            socket.off('newQuestion');
            socket.off('endQuiz');
        };
    }, []);

    return (
        <section 
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'start',
                alignItems: 'center',
                gap: '30px',
                height: '100vh',
                width: '100%',
                padding: '50px 20px'
            }}
        >
            <h2>Адмінська панель</h2>
            <UsetListAdmin
                dataList={users}
            />
            <QuestionAdmin
                text={currentQuestion}
            />
            {(leaders.length > 0) &&
                <Result
                    data={leaders}
                />
            }
            <StartEventAdmin
                isDisabled={startEvent}
            />
        </section>
    );
}

export default Admin;