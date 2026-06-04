import React from 'react';

import styles from './TimerBar.module.css'


type Props = {
    timeLeft: number
    duration: number
}

export default function TimerBar({ timeLeft, duration }: Props): React.ReactElement {
    const percentage = (timeLeft / duration) * 100

    const colorClass = 
        timeLeft > 200 ? styles.green :
        timeLeft > 100 ? styles.orange :
        styles.red

    return (
        <div className={styles.track}>
            <div
                className={`${styles.bar} ${colorClass}`}
                style={{ width: `${percentage}%` }}
                />
        </div>
    )
}