import Result from "@src/components/result/Result"
import StartEventAdmin from "@src/components/startEventAdmin/StartEventAdmin"
import UsetListAdmin from "@src/components/usersList/UserListAdmin"
import { IUser } from "@src/lib/interfaces/interfaces"
import socket from "@src/socket"
import { useEffect, useState } from "react"

const Admin = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [startEvent, setStartEvet] = useState<boolean>(false);

    useEffect(() => {
        socket.on('userList', (userList) => {
            setUsers(userList);
        });

        socket.on('requestUserList', (userList) => {
            setUsers(userList);
        })

        socket.on('newQuestion', () => {
            setStartEvet(true);
        });

        socket.on('endQuizTopOnlySorted', () => {
            setStartEvet(false);
        });
    
        socket.emit('requestUserList');

        return () => {
            socket.off('userList');
            socket.off('requestUserList');
            socket.off('newQuestion');
            socket.off('endQuizTopOnlySorted');
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
            {/* <Qus */}
            {(users.length > 0) &&
                <Result
                    data={users.sort((a, b) => b.score - a.score)}
                />
            }
            <StartEventAdmin
                isDisabled={startEvent}
            />
        </section>
    );
}

export default Admin;