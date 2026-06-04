import { useNavigate } from "react-router-dom";
import { Card, SimpleGrid, Text, Badge, Button  } from '@mantine/core';

import styles from './MenuPage.module.css'


export default function MenuPage() {
    const navigate = useNavigate()

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>Karuta</h1>
                <p className={styles.subtitle}>Memory game with music</p>
            </header>

            <div className={styles.rulesContainer}>
                <Card classNames={{ root: styles.cardWide }}>
                    <Text classNames={{ root: styles.cardText }}>
                        Here are the rules of this game: <br /><br />

                        - There is a music for each work from the theme<br />
                        - Two different cards per music<br />
                        - Each round lasts 30 seconds
                    </Text>
                </Card>
                
                <SimpleGrid cols={3} classNames={{ root: styles.grid }}>
                    <Card classNames={{ root: styles.cardSmall}}>
                        <Text classNames={{ root: styles.cardText }}>Good card found</Text>
                        <Badge size="xl" color="green" classNames={{ root: styles.badge }}>+1</Badge>
                    </Card>

                    <Card classNames={{ root: styles.cardSmall}}>
                        <Text classNames={{ root: styles.cardText }}>Wrong card found</Text>
                        <Badge size="xl" color="red" classNames={{ root: styles.badge }}>-1</Badge>
                    </Card>

                    <Card classNames={{ root: styles.cardSmall}}>
                        <Text classNames={{ root: styles.cardText }}>No card found</Text>
                        <Badge size="xl" color="red" classNames={{ root: styles.badge }}>-2</Badge>
                    </Card>
                </SimpleGrid>
            </div>

            <Button classNames={{ root: styles.button}} onClick={() => navigate('/game/anime')}>
                Anime
            </Button>
        </div>
    )
}