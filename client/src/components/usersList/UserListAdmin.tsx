import { IUser } from "@src/lib/interfaces/interfaces";
import s from './UserListAdmin.module.scss';

interface UsetListAdminProps{
    dataList: IUser[];
}

const UsetListAdmin = ({
    dataList,
}: UsetListAdminProps) => {
    return (
        <div className={s.container}>
            <h4 className={s.title}>Список учасників</h4>
            <h4 className={s.title} style={{marginBottom: '15px'}}>( готово до опитування {dataList.length} )</h4>
            <ul className={s.users_list}>
                {dataList.map((user, index) => {
                    if(user.name === 'admin') return
                    return ( 
                        <li
                            key={index}
                            className={s.item}
                        >
                            <p>Ім'я:  <span className={s.current_text}>{user.name}</span></p>
                            <p>Рахунок:  <span className={s.current_text}>{user.score}</span></p>
                            <p>Його відповідь:  <span className={s.current_text}>{user.answer ? user.answer : '-'}</span></p>
                        </li>
                    )
                })}
            </ul>
        </div>
    );
}

export default UsetListAdmin;