import React, { useEffect, useState } from 'react';
import { Grid , Container, Box, useMediaQuery, useTheme } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Friend, FriendRequest, Game } from '../datastructs/';
import toast from 'react-hot-toast';
import ProfileCard from './Cards/ProfileCard';
import FriendsCard from './Cards/FriendsCard';
import FriendRequestsCard from './Cards/FriendRequestsCard';
import GamesCard from './Cards/GamesCard';
import GameView from './Views/GameView';
import GameInvitesCard from './Cards/GameInvitesCard';


function Profile() {
	const [userData, setUserData] = useState({})
	const [friendData, setFriendData] = useState([])
	const [requestData, setRequestData] = useState([])
	const [gameData, setGameData] = useState([])
	const [inviteData, setInviteData] = useState([])
	const [error, setError] = useState('')

	const navigate = useNavigate();

	useEffect(() => {
		getData()
	}, []);

	const getData = () => {
		getProfile()
		getFriends()
		getFriendRequests()
		getGameData()
		getGameInviteData()
	}

	const getProfile = async () => {
		try {
			const authToken = localStorage.getItem('authToken')
			const response = await axios.get('http://localhost:3000/users/me', {
				headers: {
					'Authorization': `Bearer ${authToken}`,
				},
			});
			if (response.status === 200) {
				setUserData(new User(response.data))
			}
		} catch (e) {
			setError(e.response.data.error);
			if (e.response.status === 401) {
				navigate('/login');
				toast.error('Please sign in!')
			}
		}
	}

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
				setFriendData(friendList)
			}
		} catch (e) {
			setError(e.response.data.error);
			if (e.response.status === 401) {
				navigate('/login');
			}
		}
	}

	const getFriendRequests = async () => {
		try {
			const authToken = localStorage.getItem('authToken')
			const response = await axios.get('http://localhost:3000/users/friends/requests', {
				headers: {
					'Authorization': `Bearer ${authToken}`,
				},
			});
			if (response.status === 200) {
				const requestList = response.data.map((request) => new FriendRequest(request))
				setRequestData(requestList)
			}
		} catch (e) {
			setError(e.response.data.error);
			if (e.response.status === 401) {
				navigate('/login');
			}
		}
	}

	const getGameData = async () => {
		try {
			const authToken = localStorage.getItem('authToken')
			const response = await axios.get('http://localhost:3000/games', {
				headers: {
					'Authorization': `Bearer ${authToken}`,
				},
			});
			if (response.status === 200) {
				const games = response.data.map((game) => new Game(game))
				setGameData(games)
			}
		} catch (e) {
			setError(e.response.data.error);
			if (e.response.status === 401) {
				navigate('/login');
			}
		}
	}

	const getGameInviteData = async () => {
		try {
			const authToken = localStorage.getItem('authToken')
			const response = await axios.get('http://localhost:3000/users/games/invites', {
				headers: {
					'Authorization': `Bearer ${authToken}`,
				},
			});
			if (response.status === 200) {
				const invites = response.data
				setInviteData(invites)
			}
		} catch (e) {
			setError(e.response.data.error);
			if (e.response.status === 401) {
				navigate('/login');
			}
		}
	}

	return (
		<>
		<Box >
			<Grid container spacing={2} sx={{ padding: '40px'}}>
				<Grid item xs={12} md={6}>
					<ProfileCard userData={userData} />
				</Grid>
				<Grid item xs={12} md={6}>
					<FriendsCard friendData={friendData} />
				</Grid>
				<Grid item xs={12} md={6}>
					<GamesCard gameData={gameData} />
				</Grid>
				<Grid item xs={12} md={6}>
					<FriendRequestsCard requestData={requestData} getData={getData}/>
				</Grid>
				<Grid item xs={12} md={6}>
					<GameInvitesCard inviteData={inviteData} />
				</Grid>
			</Grid>
		</Box>
		</>
	);
}

export default Profile;
