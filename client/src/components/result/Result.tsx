import s from './Result.module.scss'
import { IUser } from '@src/lib/interfaces/interfaces';

interface ResultProps{
    data: IUser[];
}

const Result = ({
    data,
}: ResultProps) => {
    return (
        <div className={s.container}>
            <ul>
                {data.map((user, index) => {
                    return (
                        <li key={index}>
                            <p>Ім'я: {user.name}</p>
                            <p>Кількість правильних відповідей: {user.score}</p>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Result;