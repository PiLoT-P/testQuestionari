import { useState } from "react";
import socket from '@src/socket';
import { useNavigate } from "react-router-dom";
import s from './Join.module.scss';

const Join = () => {
    const [userName, setUseName] = useState<string>('');
    const navigate = useNavigate();

    const handleJoin = () => {
        if(userName.length > 0) {
            if(userName.toLocaleLowerCase() === 'admin'){
                navigate('admin')
            }else{
                socket.emit('join', userName);
                navigate('client')
            }
        }
    }

    return (
        <section className={s.container}>
            <img src="*" alt="Logo" />
            <form 
                className={s.name_input_block}
                onSubmit={handleJoin}
            >
                <input 
                    type="text"
                    value={userName}
                    onChange={(e) => {
                        setUseName(e.target.value);
                    }}
                    placeholder="Введіть Ім'я"
                    className={s.name_input}
                />
                <button
                    className={s.join_btn}
                    type="submit"
                >
                    Приєднатись
                </button>
            </form>
        </section>
    );
}

export default Join;