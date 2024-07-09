import { IUser } from "@src/lib/interfaces/interfaces";

interface UsetListAdminProps{
    dataList: IUser[];
}

const UsetListAdmin = ({
    dataList,
}: UsetListAdminProps) => {
    return (
        <section>
            <h4>Списк Учасників</h4>
            <ul>
                {dataList.map((user, index) => {
                    if(user.name === 'admin') return
                    return ( 
                        <li
                            key={index}
                        >
                            <p>Ім'я: {user.name}</p>
                            <p>Рахунок: {user.score}</p>
                            <p>Його відповідь: {user.answer}</p>
                            <br />
                        </li>
                    )
                })}
            </ul>
        </section>
    );
}

export default UsetListAdmin;