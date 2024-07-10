import s from './StartEventAdmin.module.scss';
import socket from "@src/socket";

interface StartEventAdminProps{
    isDisabled: boolean;
}

const StartEventAdmin = ({
    isDisabled,
}: StartEventAdminProps) => {
    const handleStartEvent = () => {
        socket.emit('startQuiz');
    };

        console.log('test', isDisabled)
    return ( 
        <div className={s.container}>
            <h4 className={s.title}>Для того, щоб розпочати опитування натисніть цю кнопку</h4>
            <button
                type="button"
                className={isDisabled ? s.disablet_btn : s.start_event_btn}
                onClick={handleStartEvent}
                disabled={isDisabled}
            >
                Розпочати опитування
            </button>
        </div>
    );
}

export default StartEventAdmin;