import { motion, AnimatePresence } from 'framer-motion'
import type { Card, CardStatus } from "../types"
import styles from "./Card.module.css"


// Props expected by the Card component
type Props = {
    card: Card // the card data (id, imageFile, label...)
    status: CardStatus // current state
    onClick: () => void // function called when the card is clicked
}


// Shake animation: triggered when status is "wrong"
const shakeVariants = {
    idle: { x: 0 },
    shake: { x : [0, -10, -10, -10, -10, 0] }
}


// Destructure props directly in the signature, typed with Props
export default function Card({ card, status, onClick }: Props) {
    return (
        <AnimatePresence>
            {status !== 'removed' && (
                <motion.div 
                    className={styles.card} 
                    onClick={onClick}
                    variants={shakeVariants}
                    animate={status === 'wrong' ? 'shake' : 'idle'}
                    transition={{ duration: 0.4 }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
                >
                    <img src={card.imageFile} alt={card.label} />
                    <div className={styles[`card--${status}`]} />
                </motion.div>
            )}
        </AnimatePresence>
        
    )
}