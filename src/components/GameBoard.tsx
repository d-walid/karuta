import type { Card, CardStatus } from '../types'
import CardComponent from './Card'
import styles from './GameBoard.module.css'


// props expected by the GameBoard components
type Props = {
    cards: Card[] // all cards to display
    cardStatuses: Record<string, CardStatus> // status of each card by id
    onCardClick: (cardId: string) => void // called when a card is clicked
}


export default function GameBoard({ cards, cardStatuses, onCardClick }: Props) {
    return (
        <div className={styles.grid}>
            {cards.map(card => (
                <CardComponent
                    key={card.id}
                    card={card}
                    status={cardStatuses[card.id] ?? 'idle'}
                    onClick={() => onCardClick(card.id)}
                />
            ))}
        </div>
    )
}