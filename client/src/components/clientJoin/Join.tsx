import { FormEvent, useState } from "react";
import socket from '@src/socket';
import { useNavigate } from "react-router-dom";
import logoSrc from '@src/assets/bertaLogoForTest.png';
import s from './Join.module.scss';


const Join = () => {
    const [userName, setUseName] = useState<string>('');
    const navigate = useNavigate();

    const handleJoin = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

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
            <img className={s.logo_image} width={200} src={logoSrc} alt="Logo" />
            <p className={s.title_text}>Для проходження вікторини прошу ввести ім'я і привізвище</p>
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