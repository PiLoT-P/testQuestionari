import logoSrc from '@src/assets/bertaLogoForTest.png'
import socket from '@src/socket'
import { FormEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import s from './Join.module.scss'


const Join = () => {
    const [userName, setUseName] = useState<string>('');
    const navigate = useNavigate();

    const handleJoin = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(userName.length > 0) {
            if(userName.toLocaleLowerCase() === 'admin'){
                navigate('/admin')
            }else{
                socket.emit('join', userName);
            }
        }
    }

    useEffect(() => {
        socket.on('userJoined', () => {
            navigate('/client')
        })

        return () => {
            socket.off('userJoined');
        }
    },[])

    return (
        <section className={s.container}>
            <div className={s.logo_block}>
                <img className={s.logo_image} width={200} src={logoSrc} alt="Logo" />
            </div>
            <p className={s.title_text}>Для проходження вікторини введіть ім'я та прізвище</p>
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