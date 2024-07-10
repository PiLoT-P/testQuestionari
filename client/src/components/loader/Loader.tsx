import s from './Loader.module.scss'

const Loader = () => {
    return (
        <div className={s.container}>
            <p className={s.text}>Опитування ще не розпочалося</p>
            <div className={s.loader}/>
        </div>
    );
}

export default Loader;