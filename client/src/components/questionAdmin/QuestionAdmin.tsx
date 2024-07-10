import s from './QuestionAdmin.module.scss';

interface QuestionAdminProps{
    text: string;
}

const QuestionAdmin = ({
    text,
}: QuestionAdminProps) => {
    return (
        <div className={s.container}>
            <p className={s.text}>Запитання: {text}</p>
        </div>
    )
}

export default QuestionAdmin;