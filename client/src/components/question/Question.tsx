import s from './Question.module.scss'

interface QuestionProps{
    question: string;
    answers: string[];
    handleAnswer: (answer: string) => void;
    time: number;
    selectedAnswer: string;
}

const Question = ({
    question,
    answers,
    handleAnswer,
    time,
    selectedAnswer
}: QuestionProps) => {
    return (
        <section className={s.container}>
            <div className={s.title_block}>
                <h3 className={s.title}>Поточне питання:</h3>
                <p className={s.question}>{question}</p>
            </div>
            <div className={s.time_block}>Залишилось часу: <span className={s.time}>{time}</span></div>
            <ul className={s.answer_list}>
                {answers.map((answer, index) => {
                    const isSelected = answer === selectedAnswer;
                    if(selectedAnswer.length > 0){
                        return (
                            <li 
                                key={index}
                                className={s.item}
                            >
                                <button
                                    type='button'
                                    onClick={() => handleAnswer(answer)}
                                    className={`${s.answer_btn} ${!isSelected && s.selected_btn}`}
                                    disabled={isSelected}
                                >       
                                    {answer}
                                </button>
                            </li>
                        )
                    }
                    return (
                        <li 
                            key={index}
                            className={s.item}
                        >
                            <button
                                type='button'
                                onClick={() => handleAnswer(answer)}
                                className={`${s.answer_btn}`}
                            >       
                                {answer}
                            </button>
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}

export default Question;