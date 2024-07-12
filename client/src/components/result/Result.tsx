import s from './Result.module.scss'
import { IUser } from '@src/lib/interfaces/interfaces';
import svg from '@src/assets/icons/symbol-defs.svg'
;
interface ResultProps{
    data: IUser[];
}

const Result = ({
    data,
}: ResultProps) => {
    const getBarColor = (index: number) => {
        switch(index) {
            case 0: return '#F3CB33';
            case 1: return '#aaaabb';
            case 2: return '#ca6e59';
            default: return 'white';
        }
    };

    const crowns = [
        "gold", 
        "silver", 
        "bronze",
    ]; 

    return (
        <div className={s.container}>
            <h4 className={s.title}> Рeйтинг відповідей </h4>
            <table className={s.table_container}>
                <thead className={s.teble_head}>
                    <tr className={s.head_line}>
                        <th className={s.head_block}>№</th>
                        <th className={`${s.head_block} ${s.name_block}`}>Ім'я</th>
                        <th className={s.head_block}>Кількість правильних відповідей</th>
                    </tr>
                </thead>
                <tbody className={s.table_body}>
                    {data.map((user, index) => (
                        <tr 
                            key={index} 
                            className={s.body_line}
                        >
                            <td className={s.body_block}>{index + 1}</td>
                            <td className={s.body_block}>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                    }}
                                >
                                    {(index < 3) &&
                                        <svg width={20} height={20}>
                                            <use xlinkHref={`${svg}#icon-medal-${crowns[index]}`} />
                                        </svg>
                                    }
                                    <p
                                        style={{
                                            backgroundColor: getBarColor(index),
                                            padding: '5px',
                                            borderRadius: '5px',
                                            color: `${index < 3 ? 'white': ''}`
                                        }}
                                    >
                                        {user.name}
                                    </p>
                                </div>
                            </td>
                            <td className={s.body_block}>{user.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Result;