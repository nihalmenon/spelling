import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, List, ListItem, ListItemText, Grid, IconButton, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, CircularProgress, Chip } from '@mui/material';
import { formatDBDate, formatTime } from '../../utils/'
import CloseIcon from '@mui/icons-material/Close'

function GameView({ gameViewModal, setGameViewModal, game = null}) {

    useEffect(() => {
        console.log(game)
        console.log([...game.correctWords, ...game.incorrectWords])
    }, [game])

    return (
        <Modal open={gameViewModal}>
			<Box
				sx={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					backgroundColor: 'background.paper',
					boxShadow: 24,
					p: 4,
					borderRadius: 8,
                    width: '320px'
				}}
			>
					<div >
                    <IconButton
                    sx={{ position: 'absolute', top: '8px', right: '8px' }}
                    onClick={() => setGameViewModal(false)}>
                        <CloseIcon/>
                    </IconButton>
					<Typography variant="h5">Game Details</Typography>
					{!game ? <CircularProgress/> : <Box mt={2}>
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <Typography variant='body1'>Date:</Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <Typography variant='body1'>{game ? formatDBDate(game.createdAt) : formatDBDate(new Date())}</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant='body1'>Duration:</Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <Typography variant='body1'>{game ? formatTime(game.duration) : 0}</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant='body1'>Score:</Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <Typography variant='body1'>{game ? game.correctWords.length : 0}/{game ? game.correctWords.length + game.incorrectWords.length : 0}</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography variant='body1'>Words:</Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <Typography variant='body1'>{game ? game.wordCount : 0}</Typography>
                            </Grid>
                        </Grid>
                        <TableContainer sx={{mt:2}}>
                            <Typography variant='h4'>Words</Typography>
                            <Table>
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
                        
						{/* <List>
							<ListItem>
								<ListItemText primary="Correct Words" secondary={stats && `${stats.correctWords.length}/${stats.correctWords.length + stats.incorrectWords.length}`} />
							</ListItem>
							<ListItem>
								<ListItemText primary="Correct Words List" secondary={stats && getWordsAsString(stats.correctWords)} />
							</ListItem>
							<ListItem>
								<ListItemText primary="Incorrect Words List" secondary={stats && getWordsAsString(stats.incorrectWords)} />
							</ListItem>
						</List> */}
					</Box>
                    }
					<Box display="flex" justifyContent="center" mt={3}>
                        <Button onClick={() => setGameViewModal(false)}>Close</Button>
					</Box>
					</div>
			</Box>
		</Modal>
    )
}

export default GameView