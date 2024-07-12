import { IUser } from '@src/lib/interfaces/interfaces';
import s from './LeadersList.module.scss'
import './LeaderList.css';
import logoSrc from '@src/assets/bertaLogoForTest.png';
import { Bar, BarChart, LabelList, Tooltip, XAxis, YAxis } from 'recharts';
import svg from '@src/assets/icons/symbol-defs.svg'

interface LeadersListProps{
    dataList: IUser[];
    isEnd: boolean;
}

const LeadersList = ({
    dataList,
    isEnd
}: LeadersListProps) => {
    console.log('testData', dataList);
    const crowns = [
        "gold", 
        "silver", 
        "bronze",
      ];

      const renderCustomizedTick = (tickProps: any) => {
        const { x, y, payload, index } = tickProps;
        const crown = crowns[index];
        if (index < 3) {
          return (
            <g transform={`translate(${x-25},${y + 30})`}>  
              <svg width={50} height={50}>
                <use xlinkHref={`${svg}#icon-medal-${crown}`} />
              </svg>
              <text x={25} y={-5 } textAnchor="middle" fill="#3E5871" fontSize="28px" fontWeight="700">
                {payload.value}
              </text>
            </g>
          );
        }
        return (
          <g transform={`translate(${x},${y})`}>
            <text x={0} y={30} textAnchor="middle" fill="#3E5871" fontSize="28px" fontWeight="700">
              {payload.value}
            </text>
          </g>
        );
      };
    return (
        <div className={s.container}>
            <div className={s.logo_block}>
                <img className={s.logo_image} width={200} src={logoSrc} alt="Logo" />
            </div>
            {isEnd ?
                <h1 className={s.title}>Вітаємо!!! Вікторину завершено, ось переможці</h1>
                :
                <h1 className={s.title}>Топ-5 Гравців</h1>
            }
            <BarChart 
                width={1300} 
                height={650} 
                data={dataList}
                margin={{ top: 5, right: 60, left: 0, bottom: 0 }}
            >
                <XAxis 
                    dataKey="name"
                    tick={renderCustomizedTick}
                    interval={0}
                    height={100}
                    angle={-45}
                    textAnchor="end"
                    dy={10}
                    dx={0}
                />
                <YAxis domain={[0, 'dataMax']} tick={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="score" fill={'#60CE74'} >
                    <LabelList
                        fill='black'
                        position='center'
                        style={{
                            fontSize: '25px',
                            fontWeight: '700',
                            fill: 'white'
                        }}
                    />
                </Bar>
                <Bar dataKey="notCorrect" fill="#db4133" >
                    <LabelList
                        fill='black'
                        position='center'
                        style={{
                            fontSize: '25px',
                            fontWeight: '700',
                            fill: 'white'
                        }}
                    />
                </Bar>
            </BarChart>
        </div>
    );
}

export default LeadersList;