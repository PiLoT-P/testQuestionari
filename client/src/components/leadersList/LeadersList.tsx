import { IUser } from '@src/lib/interfaces/interfaces';
import s from './LeadersList.module.scss'
import './LeaderList.css';
import FlipMove from 'react-flip-move';
import svg from '@src/assets/icons/symbol-defs.svg';
import logoSrc from '@src/assets/bertaLogoForTest.png';

interface LeadersListProps{
    dataList: IUser[];
    isEnd: boolean;
}

const LeadersList = ({
    dataList,
    isEnd
}: LeadersListProps) => {

    console.log('testData', dataList)
    return (
        <div>
            <div className={s.logo_block}>
                <img className={s.logo_image} width={200} src={logoSrc} alt="Logo" />
            </div>
            {isEnd ?
                <h1 className={s.title}>Вітаємо!!! Вікторину закінчено, ось переможці</h1>
                :
                <h1 className={s.title}>Топ-5 Гравців</h1>
            }
            <FlipMove className={s.leaders_list} duration={500} easing="ease-in-out">
                {dataList.map((player, index) => (
                    <li 
                        key={player.name} 
                        className={s.item}
                        style={{
                            color: index <= 2 ? 'white' : '', 
                            backgroundColor: index === 0 ? '#F3CB33' : index === 1 ? '#aaaabb' : index === 2? '#aa7700' : '',
                        }}
                    >
                        {index <=2 &&
                            <svg width={40} height={40} className={s.icon}>
                                <use xlinkHref={`${svg}#icon-trophy`} />
                            </svg>
                        }
                        <p>{player.name}: {player.score} балів</p>
                    </li>
                ))}
            </FlipMove>
        </div>
    );
}

export default LeadersList;