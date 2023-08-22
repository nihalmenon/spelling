import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, List, ListItem, ListItemText, Grid, IconButton, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, CircularProgress, Paper, Link } from '@mui/material';
import { formatDBDate, formatTime } from '../../utils/'
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../requests/axios';
import toast from 'react-hot-toast';

function GameView({  }) {
    const navigate = useNavigate()
    const { id } = useParams()
    const [game, setGame] = useState(null)

    const fetchGameData = async () => {
        try {
			const authToken = localStorage.getItem('authToken')
			const response = await axios.get('/games/' + id, {
				headers: {
					'Authorization': `Bearer ${authToken}`,
				},
			});
			if (response.status === 200) {
				const result = response.data
                console.log(result)
				setGame(result)
			}
		} catch (e) {
			if (e.response.status === 404) {
                toast.error('Game not found!')
                navigate('/app/profile')
            }
			if (e.response.status === 401) {
                toast.error('Please login!')
				navigate('/login')
			}
		}
    };

    useEffect(() => {
        fetchGameData()
    }, [id])

    return (
        <Box
        sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            // bgcolor: 'primary.main',
            color: 'text.ternary'
        }}
    >
        <Paper elevation={3} sx={{ p: 3, width: '65vw', minWidth: '300px', textAlign: 'center' }}>
            <div>
                <Typography variant="h4">Game Details</Typography>
                {!game ? <CircularProgress/> : <Box mt={2}>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <Typography variant='body1'>Date:</Typography>
                        </Grid>
                        <Grid item xs={9}>
                            <Typography variant='body1'>{formatDBDate(game.createdAt)}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography variant='body1'>Duration:</Typography>
                        </Grid>
                        <Grid item xs={9}>
                            <Typography variant='body1'>{formatTime(game.duration)}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography variant='body1'>Score:</Typography>
                        </Grid>
                        <Grid item xs={9}>
                            <Typography variant='body1'>{game.score}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography variant='body1'>Word Count:</Typography>
                        </Grid>
                        <Grid item xs={9}>
                            <Typography variant='body1'>{game.wordCount}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography variant='body1'>Rank:</Typography>
                        </Grid>
                        <Grid item xs={9}>
                            <Typography variant='body1'>{game.rank}/{game.numPlayers}</Typography>
                        </Grid>
                    </Grid>
                    {game.leaderboard.length > 0 && (
                        <TableContainer component={Paper} sx={{mt:2, paddingTop:2}}>
                        <Typography variant='body1'>Rankings</Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Rank</TableCell>
                                    <TableCell>Player</TableCell>
                                    <TableCell>Score</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {game.leaderboard.map((player, index) => (
                                    <TableRow key={player.user._id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{player.user.name}</TableCell>
                                        <TableCell>{player.score}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        </TableContainer>
                    )}
                    <TableContainer component={Paper} sx={{mt:2, paddingTop:2}}>
                        <Typography variant='body1'>Words</Typography>
                        <Table sx={{ px: 1}}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        Word
                                    </TableCell>
                                    <TableCell>
                                        Result
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {[...game.correctWords, ...game.incorrectWords].map((word, i) => (
                                    <TableRow key={word._id}>
                                        <TableCell>
                                            {word.word}
                                        </TableCell>
                                        <TableCell>
                                            {i >= game.correctWords.length ? "Incorrect" : "Correct"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                }
                <Box display="flex" justifyContent="center" mt={3}>
                    <a href='/app/profile' style={{textDecoration:'none'}}><Button>Home Page</Button></a>
                </Box>
            </div>
        </Paper>
    </Box>
    )
}

export default GameView