import React, { useEffect, useState } from 'react';
import { Box, Modal, IconButton, Autocomplete, TextField, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Friend } from '../../datastructs/';
import { Close, Search } from '@mui/icons-material';
import toast from 'react-hot-toast';

function FriendSearchModal({ inviteModal, setInviteModal, room }) {
    const [friends, setFriends] = useState([])
	const [selectedFriend, setSelectedFriend] = useState({})

	const toggleInviteModal = () => {
		setInviteModal(!inviteModal)
	}

    const navigate = useNavigate()
	const authToken = localStorage.getItem('authToken')

    useEffect(() => {
        getFriends()
    }, [])

    const getFriends = async () => {
		try {
			const response = await axios.get('http://localhost:3000/users/friends', {
				headers: {
					'Authorization': `Bearer ${authToken}`,
				},
			});

			if (response.status === 200) {
				const friendList = response.data.friends.map((friend) => new Friend(friend))
				setFriends(friendList)
			}
		} catch (e) {

		}
	}

	const handleSendInvite = async () => {
		try {
			const response = await axios.post('http://localhost:3000/users/games/invites/send', {email: selectedFriend, room }, {
				headers: {
					'Authorization': `Bearer ${authToken}`,
				},
			});

			if (response.status === 200) {
				const friendList = response.data.friends.map((friend) => new Friend(friend))
				setFriends(friendList)
			}
		} catch (e) {
			toast.error("Couldn't send invite!")
		}
		setInviteModal(false)
	}

    return (
        <Modal open={inviteModal}>
			<Box sx={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					backgroundColor: 'background.paper',
					boxShadow: 24,
					p: 4,
					borderRadius: 8,
					width: '300px',
				}}>
				<IconButton sx={{ position: 'absolute', top: '8px', right: '8px' }} onClick={toggleInviteModal}>
					<Close/>
				</IconButton>
				<Box sx={{mt:2}}>
				<Autocomplete 
					options={friends}
					autoHighlight
					getOptionLabel={(option) => option.email}
					renderOption={(props, option) => (
						<Box component="li" {...props}>
						{option.email}
						</Box>
					)}
					renderInput={(params) => (
						<TextField
						{...params}
						label="Choose a friend"
						InputProps={{
							...params.InputProps,
							startAdornment: (
							<Search color="action" />
							),
							autoComplete: 'new-password',
						}}
						/>
					)}
					onInputChange={(event, newInputValue) => {
						setSelectedFriend(newInputValue);
					}}
					/>
				<Button variant="contained" color="primary" onClick={handleSendInvite} sx={{mt:2, mx: 'auto'}}>
					Send Invite
				</Button>
				</Box>
			</Box>
		</Modal>
    )
}

export default FriendSearchModal;