import StartEventAdmin from "@src/components/startEventAdmin/StartEventAdmin";
import UsetListAdmin from "@src/components/usersList/UserListAdmin";
import { IUser } from "@src/lib/interfaces/interfaces";
import socket from "@src/socket";
import { useEffect, useState } from "react";

const Admin = () => {
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        socket.on('userList', (userList) => {
            setUsers(userList);
        });
    
        socket.emit('requestUserList');

        return () => {
            socket.off('userList');
        };

    }, []);

    return (
        <section>
            <h2>Адмінська панель</h2>
            <UsetListAdmin
                dataList={users}
            />
            <StartEventAdmin/>
        </section>
    );
}

export default Admin;