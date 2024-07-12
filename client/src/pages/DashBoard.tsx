import LeadersList from '@src/components/leadersList/LeadersList'
import Loader from '@src/components/loader/Loader'
import { IUser } from '@src/lib/interfaces/interfaces'
import socket from '@src/socket'
import { useEffect, useState } from 'react'

const DashBoard = () => {
  const [quizStarted, setQuizStarted] = useState<boolean>(false)
  const [topPlayers, setTopPlayers] = useState<IUser[]>([])
  const [isEnd, setIsEnd] = useState<boolean>(false);

  useEffect(() => {
    socket.on('newQuestion', () => {
      setQuizStarted(true)
      socket.emit('requestTop5')
      setIsEnd(false)
    })

    socket.on('endQuiz', leaders => {
      setTopPlayers(leaders)
      setIsEnd(true);
    })

    socket.on('top5', (leaders: IUser[]) => {
      setTopPlayers(leaders)
    })

    socket.on('resetQuiz', () => {
      setQuizStarted(false)
      setTopPlayers([])
      setIsEnd(false);
    })

    return () => {
      socket.off('top5')
      socket.off('newQuestion')
      socket.off('endQuiz')
    }
  }, [])

  return (
    <section
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%',
        backgroundColor: '#fff',
        color: '#3E5871',
      }}
    >
      {!quizStarted ? (
        <Loader />
      ) : (
        <LeadersList
            isEnd={isEnd}
            dataList={topPlayers}
        />
        // <div className={s.container}>
        //   <div className={s.logo_block}>
        //     <img
        //       className={s.logo_image}
        //       width={200}
        //       src={logoSrc}
        //       alt='Logo'
        //     />
        //   </div>
        //   <Result data={topPlayers} />
        // </div>
      )}
    </section>
  )
}

export default DashBoard
