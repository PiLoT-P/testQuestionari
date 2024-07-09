import s from './Question.module.scss'

interface QuestionProps{
    question: string;
    answers: string[];
    handleAnswer: (answer: string) => void;
}

const Question = ({
    question,
    answers,
    handleAnswer
}: QuestionProps) => {
    return (
        <section className='global-container'>
            <h3 className={s.title}>Поточне питання:</h3>
            <p>{question}</p>
            <ul>
                {answers.map((answer, index) => (
                    <li key={index}>
                        <button
                            type='button'
                            onClick={() => handleAnswer(answer)}
                        >       
                            {answer}
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default Question;