import LeadersList from '@src/components/leadersList/LeadersList'
import Loader from '@src/components/loader/Loader'
import { IUser } from '@src/lib/interfaces/interfaces'
import socket from '@src/socket'
import { useEffect, useState } from 'react'

const DashBoard = () => {
  const [quizStarted, setQuizStarted] = useState<boolean>(false)
  const [topPlayers, setTopPlayers] = useState<IUser[]>([]);
  const [listForEnd, setListForEnd] = useState<IUser[]>([]);
  const [isEnd, setIsEnd] = useState<boolean>(false);

  useEffect(() => {
    socket.on('answer', () => {
      setQuizStarted(true);
      setIsEnd(false);
      console.log('Quiz started:', quizStarted, 'Is end:', isEnd);
    });
  
    socket.on('userList', (users) => {
      setQuizStarted(true);
      console.log('User list received:', users);
      socket.emit('requestTop5');
    });
  
    socket.on('endQuizTop', (topUsers) => {
      setIsEnd(true);
      setListForEnd(topUsers);
      console.log('Quiz ended. Top users:', topUsers);
    });
  
    socket.on('top5', (leaders: IUser[]) => {
      setTopPlayers(leaders);
      console.log('Top 5 players:', leaders);
    });
  
    socket.on('resetQuiz', () => {
      console.log('Quiz reset');
      setQuizStarted(false);
      setTopPlayers([]);
      setListForEnd([]);
      setIsEnd(false);
    });
  
    return () => {
      socket.off('top5');
      socket.off('newQuestion');
      socket.off('endQuiz');
    };
  }, []);

  useEffect(() => {
    console.log('top', topPlayers, 'is end', isEnd)

  }, [topPlayers])

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
                dataList={isEnd ? listForEnd : topPlayers}
            />
        )}
    </section>
  )
}

export default DashBoard
