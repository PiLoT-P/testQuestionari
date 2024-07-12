import logoSrc from '@src/assets/bertaLogoForTest.png'
import { IUser } from '@src/lib/interfaces/interfaces'
import {
  Bar,
  BarChart,
  Label,
  LabelList,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import './LeaderList.css'
import s from './LeadersList.module.scss'

interface LeadersListProps {
  dataList: IUser[]
  isEnd: boolean
}

const LeadersList = ({ dataList, isEnd }: LeadersListProps) => {
  console.log('testData', dataList);

  return (
    <div className={s.container}>
      <div className={s.logo_block}>
        <img className={s.logo_image} width={200} src={logoSrc} alt='Logo' />
      </div>
      {isEnd ? (
        <h1 className={s.title}>
          Вітаємо!!! Вікторину завершено, ось переможці
        </h1>
      ) : (
        <h1 className={s.title}>Топ-5 Гравців</h1>
      )}
      <BarChart
        width={1300}
        height={750}
        data={dataList}
        layout='vertical'
        margin={{
          right: 45,
          left: 125,
          bottom: 25,
        }}
      >
        <XAxis type='number' axisLine={false} tick={false}>
          <Label
            position='insideBottom'
            offset={-15}
            style={{ textAnchor: 'middle', fontSize: '18px' }}
          />
        </XAxis>
        <YAxis
          type='category'
          dataKey='name'
          style={{ fontSize: '24px' }}
        ></YAxis>
        <Tooltip />
        <Bar dataKey='score' fill='#3E5871'>
          <LabelList
            fill='#FFFFFF'
            position='center'
            style={{ fontSize: '18px' }}
          />
        </Bar>
      </BarChart>
    </div>
  )
}

export default LeadersList
