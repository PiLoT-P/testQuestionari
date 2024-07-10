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
            <h4 className={s.title}> Рeйтинг відповідей </h4>
            <table className={s.table_container}>
                <thead className={s.teble_head}>
                    <tr className={s.head_line}>
                        <th className={s.head_block}>№</th>
                        <th className={s.head_block}>Ім'я</th>
                        <th className={s.head_block}>Кількість правильних відповідей</th>
                    </tr>
                </thead>
                <tbody className={s.table_body}>
                    {data.map((user, index) => (
                        <tr key={index} className={s.body_line}>
                            <td className={s.body_block}>{index + 1}</td>
                            <td className={s.body_block}>{user.name}</td>
                            <td className={s.body_block}>{user.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Result;