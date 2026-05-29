import { useNavigate } from "react-router-dom";
import styles from './MenuPage.module.css'


export default function MenuPage() {
    const navigate = useNavigate()

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>Karuta</h1>
                <p className={styles.subtitle}>Memory game with music</p>
                <ul className={styles.rules}>
                    <li>Two differents cards per music</li>
                    <li>The round have 30sec length</li>
                    <br />
                    <li>1 good card found : 1 point</li>
                    <li>1 bad card selected  : -1 point</li>
                    <li>No cards found during the round : -2 points</li>
                </ul>
            </header>
            <button className={styles.button} onClick={() => navigate('/game/anime')}>
                Anime
            </button>
        </div>
    )
}