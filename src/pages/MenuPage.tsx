import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchLeaderboard, type LeaderboardEntry } from "../data/api";
import { formatTime } from "../utils/formatTime";

import { Card, SimpleGrid, Text, Badge, Button, Table } from '@mantine/core';
import styles from './MenuPage.module.css'



export default function MenuPage() {
    const navigate = useNavigate()
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

    useEffect(() => {
        fetchLeaderboard().then(setLeaderboard).catch(console.error)
    }, [])

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>Karuta</h1>
                <p className={styles.subtitle}>Memory game with music</p>
            </header>

            <div className={styles.content}>
                <div className={styles.left}>
                    <div className={styles.rulesContainer}>
                        <Card classNames={{ root: styles.cardWide }}>
                            <Text classNames={{ root: styles.cardText }}>
                                Here are the rules of this game: <br /><br />

                                - There is a music for each work from the theme<br />
                                - Two different cards per music<br />
                                - Each round lasts 30 seconds<br />
                                - Find a car within 5 seconds for a speed bonus<br />
                                - 3 pairs in a row and trigger combo mode !
                            </Text>
                        </Card>

                        <SimpleGrid cols={3} classNames={{ root: styles.grid }}>
                            <Card classNames={{ root: styles.cardSmall }}>
                                <Text classNames={{ root: styles.cardText }}>Correct card</Text>
                                <Badge size="xl" color="green" classNames={{ root: styles.badge }}>+1 to +3</Badge>
                            </Card>

                            <Card classNames={{ root: styles.cardSmall }}>
                                <Text classNames={{ root: styles.cardText }}>Wrong card</Text>
                                <Badge size="xl" color="red" classNames={{ root: styles.badge }}>-1</Badge>
                            </Card>

                            <Card classNames={{ root: styles.cardSmall }}>
                                <Text classNames={{ root: styles.cardText }}>No card found</Text>
                                <Badge size="xl" color="red" classNames={{ root: styles.badge }}>-2</Badge>
                            </Card>
                        </SimpleGrid>
                    </div>
                </div>

                <div className={styles.right}>
                        <div className={styles.leaderboard}>
                            <h2 className={styles.leaderboardTitle}>Leaderboard</h2>
                            <Table classNames={{ table: styles.table }}>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>#</Table.Th>
                                        <Table.Th>Nickname</Table.Th>
                                        <Table.Th>Theme</Table.Th>
                                        <Table.Th>Score</Table.Th>
                                        <Table.Th>Time</Table.Th>
                                        <Table.Th>Errors</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {leaderboard.map((entry, index) => {
                                        const time = formatTime(entry.duration_ms)
                                        return (
                                            <Table.Tr key={entry.id}>
                                                <Table.Td>{index + 1}</Table.Td>
                                                <Table.Td>{entry.nickname}</Table.Td>
                                                <Table.Td>{entry.theme}</Table.Td>
                                                <Table.Td>{entry.score}</Table.Td>
                                                <Table.Td>{time}</Table.Td>
                                                <Table.Td>{entry.errors}</Table.Td>
                                            </Table.Tr>
                                        )
                                    })}
                                </Table.Tbody>
                            </Table>
                        </div>
                </div>
            </div>

            <div className={styles.themeButtons}>
                <Button classNames={{ root: styles.button }} onClick={() => navigate('/game/anime')}>
                    Anime
                </Button>
                <Button classNames={{ root: styles.button }} onClick={() => navigate('/game/movie')}>
                    Movie
                </Button>
            </div>
        </div>
    )
}