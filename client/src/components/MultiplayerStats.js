import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, List, ListItem, ListItemText, Table, TableContainer, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
import { getWordsAsString } from '../utils/'

function MultiplayerStats({ stats }) {
    useEffect(() => {
        console.log(stats)
    }, [stats])
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
                <div >
                <Typography variant="h5">Game Stats</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Rank</TableCell>
                                <TableCell>Player</TableCell>
                                <TableCell>Score</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stats.leaderboard.map((player, index) => (
                                <TableRow key={player.user._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{player.user.name}</TableCell>
                                    <TableCell>{player.score}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box mt={2}>
                    <List>
                        <ListItem>
                            <ListItemText primary="Correct Words" secondary={stats && `${stats.score}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Correct/Total" secondary={stats && `${stats.correctWords.length}/${stats.correctWords.length + stats.incorrectWords.length}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Correct Words List" secondary={stats && getWordsAsString(stats.correctWords)} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Incorrect Words List" secondary={stats && getWordsAsString(stats.incorrectWords)} />
                        </ListItem>
                    </List>
                </Box>
                <Box display="flex" justifyContent="center" mt={3}>
                    <a href='/app/room' style={{textDecoration:'none'}}><Button>Start new game</Button></a>
                    <a href='/app/profile' style={{textDecoration:'none'}}><Button>Home Page</Button></a>
                </Box>
                </div>
            </Paper>
        </Box>
    )
}

export default MultiplayerStats