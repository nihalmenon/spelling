import React, { useState, useEffect } from 'react';
import { Paper, IconButton, Box, Typography, Button, CircularProgress, Modal, Select, MenuItem, Alert, ListItem, List } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import FriendSearchModal from './Modals/FriendSearchModal';

function WaitingRoom({ userData, isOwner, duration, gameStartModal, handleChangeDuration, profileLoading, handleStartGame, players, toggleGameStartModal, room }) {
	const [inviteModal, setInviteModal] = useState(false)
	const [selectedFriend, setSelectedFriend] = useState({})

	const toggleInviteModal = () => {
		setInviteModal(!inviteModal)
	}

	return (
        <>
		<Paper elevation={3} sx={{ p: 3, width: '65vw', minWidth: '300px', textAlign: 'center' }}>
			<Box mb={2}>
				<Typography variant="h5">Waiting Room</Typography>
				<Typography variant='h6'>{room}</Typography>
			</Box>
			<Box mb={2}>
				<Typography variant="body1">Players in the room:</Typography>
				<div>
					{players.map((player, index) => (
						<div key={index}>{player.name}</div>
					))}
				</div>
			</Box>
			<Box mb={2}>
				<Typography variant="body2">Waiting for more players to join...</Typography>
				<CircularProgress size={30} sx={{ mt: 1 }} />
			</Box>
            <Box>
				{/* <Button onClick={toggleInviteModal}>Invite Friend</Button> */}
                {isOwner && <Button onClick={toggleGameStartModal}>Start Game</Button>}
            </Box>
		</Paper>
		{/* <FriendSearchModal inviteModal={inviteModal} toggleInviteModal={toggleInviteModal} setSelectedFriend={setSelectedFriend}/> */}
        {isOwner && <Modal open={gameStartModal}>
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
					width: '300px',
				}}
			>
                    <IconButton sx={{ position: 'absolute', top: '8px', right: '8px' }} onClick={toggleGameStartModal}>
                        <CloseIcon/>
                    </IconButton>
                    <div>
						<Typography variant="h5" gutterBottom>
							Spelling Game Options
						</Typography>
						<Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
							<Typography variant="h6">Duration:</Typography>
							<span>&emsp;</span>
							<Select value={duration} onChange={handleChangeDuration}>
								<MenuItem value={10}>10 seconds</MenuItem>
								<MenuItem value={60}>1 Minute</MenuItem>
								<MenuItem value={120}>2 Minutes</MenuItem>
								<MenuItem value={300}>5 Minutes</MenuItem>
							</Select>
						</Box>
						<Box mt={2} display="flex" justifyContent="flex-end">
							{!profileLoading && isOwner === true && <Button variant="contained" color="primary" onClick={handleStartGame}>
								Start Game
							</Button>}
						</Box>
					</div>
			</Box>
		</Modal>}
        </>
	);
}

export default WaitingRoom;
