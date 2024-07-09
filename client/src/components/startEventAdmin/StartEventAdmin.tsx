import s from './StartEventAdmin.module.scss';
import socket from "@src/socket";


const StartEventAdmin = () => {
    const handleStartEvent = () => {
        socket.emit('startQuiz');
    };

    return (
        
        <div className={s.container}>
            <button
                type="button"
                className={s.start_event_btn}
                onClick={handleStartEvent}
            >
                Розпочати опитування
            </button>
        </div>
    );
}

export default StartEventAdmin;