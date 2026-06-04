import { useNavigate } from "react-router-dom";
import { Howler } from 'howler'

import { useGameStore } from "../stores/useGameStore";
import { Badge, Button } from '@mantine/core';

import styles from './ResultsPage.module.css'


export default function ResultsPage() {
    const navigate = useNavigate()
    const { score, errors, rounds, resetGame } = useGameStore()
    const foundRounds = rounds.filter(r => r.status === 'success')
    const missedRounds = rounds.filter(r => r.status === 'timeout')

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Game finished!</h1>

            <div className={styles.stats}>
                <Badge
                    variant="outline"
                    color="var(--color-gold)"
                    size="xl"
                    classNames={{ root: styles.badge }}>
                        Score: {score}
                    </Badge>

                <Badge
                    variant="outline"
                    color="var(--color-gold)"
                    size="xl"
                    classNames={{ root: styles.badge }}>
                        Found pairs: {foundRounds.length}/{rounds.length}
                    </Badge>

                <Badge
                    variant="outline"
                    color="var(--color-gold)"
                    size="xl"
                    classNames={{ root: styles.badge }}>
                        Errors: {errors}
                    </Badge>
            </div>

            <div className={styles.lists}>
                <div className={styles.listBlock}>
                    <h2 className={styles.listTitleFound}>
                        Found ({foundRounds.length})
                    </h2>
                    <ul className={styles.list}>
                        {foundRounds.map(r => (
                            <li key={r.music.id} className={styles.found}>
                                {r.music.title}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={styles.listBlock}>
                    <h2 className={styles.listTitleMissed}>
                        Missed ({missedRounds.length})
                    </h2>
                    <ul className={styles.list}>
                        {missedRounds.map(r => (
                            <li key={r.music.id} className={styles.missed}>
                                {r.music.title}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <Button
                onClick={() => { Howler.stop(); resetGame(); navigate('/') }}
                classNames={{ root: styles.button }}
            >
                Back to menu
            </Button>
        </div>
    )
}