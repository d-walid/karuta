import { motion, AnimatePresence } from 'framer-motion'
import type { Card, CardStatus } from "../types"
import styles from "./Card.module.css"


// Props expected by the Card component
type Props = {
    card: Card // the card data (id, imageFile, label...)
    status: CardStatus // current state
    onClick: () => void // function called when the card is clicked
    points?: number | null
}


// Shake animation: triggered when status is "wrong"
const shakeVariants = {
    idle: { x: 0 },
    shake: { 
        x : [0, -8, -8, -8, -8, 0],
        y : [0, -4, -4, -4, -4, 0],
        rotate: [0, -3, 3, -3, 3, 0]

     }
}


// Destructure props directly in the signature, typed with Props
export default function Card({ card, status, onClick, points = null }: Props) {
    return (
        <div className={styles.placeholder}>
            <AnimatePresence>
                {status !== 'removed' && (
                    <motion.div
                        key={card.id}
                        className={styles.card} 
                        onClick={onClick}
                        variants={shakeVariants}
                        animate={status === 'wrong' ? 'shake' : 'idle'}
                        transition={{ duration: 0.4 }}
                        exit={{ opacity: 0, scaleX: 0, scaleY: 0, transition: { duration: 0.7, ease: 'easeIn'} }}
                    >
                        <img src={card.imageFile} alt={card.label} />
                        <div className={styles[`card--${status}`]} />
                        <AnimatePresence>
                            {points !== null && (
                                <motion.div
                                    key={`points-${points}`}
                                    className={styles.pointsPopup}
                                    initial={{ opacity: 0, y: 0 }}
                                    animate={{ opacity: 1, y: -15 }}
                                    exit={{ opacity: 0, y: -30 }}
                                    transition={{ duration: 0.6, ease: 'easeOut'}}
                                    style={{
                                        color: points > 0 ? 'rgb(255, 255, 255)' : 'rgb(178, 58, 72)'
                                    }}
                                >
                                    {points > 0 ? `+${points}` : points}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
