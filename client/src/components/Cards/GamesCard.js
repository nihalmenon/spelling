import React, { useEffect, useState } from 'react'
import axios from '../../requests/axios'
import { Card, CardContent, Typography, Box, CardHeader, Button, ListItem, Modal, TextField, IconButton, Link } from '@mui/material'
import { User } from '../../datastructs'
import CloseIcon from '@mui/icons-material/Close'
import toast from 'react-hot-toast'
import { formatDBDate } from '../../utils/time'

const GamesCard = ({ gameData }) => {
    const MAX_DISPLAY_GAMES = 6
    const [displayedGames, setDisplayedGames] = useState([])

	const [showAllGames, setShowAllGames] = useState(false);

	const seeMore = () => {
		setShowAllGames(true);
	}

	const collapseList = () => {
		setShowAllGames(false);
	}

	useEffect(() => {
		if (showAllGames) {
			setDisplayedGames(gameData);
		} else {
			setDisplayedGames(gameData.slice(0, MAX_DISPLAY_GAMES));
		}
	}, [gameData, showAllGames])


    return (
		<Card
			sx={{
				boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
				borderRadius: '8px',
				backgroundColor: 'white',
				padding: '16px',
				display: 'flex',
				flexDirection: 'column',
				color: 'text.grey',
			}}
		>
			<CardHeader title="Games" sx={{ borderBottom: '1px solid #f0f0f0', color: 'primary.main' }} />
			<CardContent>
				{displayedGames.map((game) => (
					<ListItem key={game._id} sx={{ paddingLeft: 0 }}>
						<Typography variant="body1">
							<Link href={"/app/game/" + game._id}>
								{formatDBDate(game.createdAt)}
							</Link>{' '}
							- Score: {game.score}
						</Typography>
					</ListItem>
				))}
				{gameData && gameData.length > MAX_DISPLAY_GAMES && (
					<>
						{showAllGames ? (
							<Button variant="text" onClick={collapseList}>
								See Less
							</Button>
						) : (
							<Button variant="text" onClick={seeMore}>
								See More
							</Button>
						)}
					</>
				)}
			</CardContent>
		</Card>
	);
}

export default GamesCard