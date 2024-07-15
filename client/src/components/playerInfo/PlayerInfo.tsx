import { IUser } from "@src/lib/interfaces/interfaces";
import s from './PlayerInfo.module.scss';

interface PlayerInfoProps{
    user: IUser;
}

const PlayerInfo = ({
    user
}: PlayerInfoProps) => {
    return (
        <div className={s.container}>
            <h3 className={s.title}>Вітаємо з завершенням опитування. Ваша статистика.</h3>
            <div className={s.info_block}>
                <p>Ім'я:  <span className={s.info}>{user.name}</span></p>
                <p>Кількість правильних відповідей: <span className={s.info}>{user.score}</span></p>
                <p>Кількість не правильних відповідей: {user.notCorrect}</p>
            </div>
        </div>
    );
}

export default PlayerInfo;