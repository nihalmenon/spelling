import React, { useEffect, useState } from 'react';
import { Box, Modal, IconButton, Autocomplete, TextField, SearchIcon } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Friend } from '../../datastructs/';
import { Close, Search } from '@mui/icons-material';
import toast from 'react-hot-toast';

function FriendSearchModal({ inviteModal, toggleInviteModal, selectedFriend, setSelectedFriend }) {
    const [friends, setFriends] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        getFriends()
    }, [])

    const getFriends = async () => {
		try {
			const authToken = localStorage.getItem('authToken')
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
			if (e.response.status === 401) {
				navigate('/login');
			}
		}
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
				<div>
                <Autocomplete
                    options={friends}
                    getOptionLabel={(friend) => friend.name}
                    renderOption={(friend) => <span>{friend.name}</span>}
                    renderInput={(params) => (
                        <TextField
                        {...params}
                        label="Select a friend"
                        variant="outlined"
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                            <>
                                <Search color="action" />
                                {params.InputProps.startAdornment}
                            </>
                            ),
                        }}
                        />
                    )}
                    onChange={(event, newValue) => {
                        setSelectedFriend(newValue);
                    }}
                    value={selectedFriend}
                />
				</div>
			</Box>
		</Modal>
    )
}

export default FriendSearchModal;