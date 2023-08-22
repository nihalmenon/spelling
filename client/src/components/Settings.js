import React, { useState, useEffect } from 'react';
import { Box, Paper, TextField, Modal, Typography, Button  } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { User } from '../datastructs';
import axios from '../requests/axios';
import toast from 'react-hot-toast';

function Settings() {
    const [loading, setLoading] = useState(false)
    const [userData, setUserData] = useState(null)
    const [bufferUpdates, setBufferUpdates] = useState({ name: '', email: ''})
    const [bufferPassword, setBufferPassword] = useState('')
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const navigate = useNavigate()
	const authToken = localStorage.getItem('authToken')

    useEffect(() => {
        getProfile()
    }, [])

    useEffect(() => {
        if (userData) {
            setBufferUpdates(prev => ({ name: userData.name, email: userData.email }))
        }
    }, [userData])

    const getProfile = async () => {
        setLoading(true)
		try {
			const response = await axios.get('/users/me', {
				headers: {
					'Authorization': `Bearer ${authToken}`,
				},
			});
			if (response.status === 200) {
				setUserData(new User(response.data))
			}
		} catch (e) {
			
			if (e.response.status === 401) {
				navigate('/login');
				toast.error('Please sign in!')
			}else {
                toast.error('Something went wrong!')
            }
		}
        setLoading(false)
	}

    const handleUpdateProfile = async () => {
        let updates = bufferUpdates;
        if (bufferPassword !== "") {
            updates.password = bufferPassword   
        }
        try {
			const response = await axios.patch('/users/me', updates, {
				headers: {
					'Authorization': `Bearer ${authToken}`,
				},
			});

            if (response.status === 200) {
                toast.success('Successfully updated user!')
            }

        } catch (e) {
            if (e.response.status === 401) {
				navigate('/login');
				toast.error('Please sign in!')
			}else {
                toast.error('Something went wrong!')
            }
        }
    }

    const handleDeleteAccount = async () => {
        try {
			const response = await axios.delete('/users/me', {
				headers: {
					'Authorization': `Bearer ${authToken}`,
				},
			});

            if (response.status === 200) {
                toast.success('Successfully deleted user!')
                navigate('/login')
            }

        } catch (e) {
            if (e.response.status === 401) {
				navigate('/login');
				toast.error('Please sign in!')
			}else {
                toast.error('Something went wrong!')
            }
        }
    }

	const logoutAllDevices = async () => {
		try {
			const response = await axios.post('/users/logoutAll', null, {
				headers: {
				'Authorization': `Bearer ${authToken}`
				}
			});
	
			if (response.status === 200) {
				localStorage.removeItem('authToken')
				navigate('/')
				toast.success('Logged out!')
			}
		} catch (e) {
			console.log(e)
			navigate('/error')
		}
	}

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                color: 'text.ternary'
            }}
        >
            <Paper elevation={3} sx={{ p: 3, width: '65vw', minWidth: '300px', textAlign: 'center' }}>
            <Box>
				<TextField
					label="Name"
					value={bufferUpdates.name}
					onChange={(e) => setBufferUpdates(prev => ({...prev, name: e.target.value}))}
					fullWidth
					margin="normal"
				/>
				<TextField
					label="Email"
					value={bufferUpdates.email}
					onChange={(e) => setBufferUpdates(prev => ({...prev, email: e.target.value}))}
					fullWidth
					margin="normal"
				/>
				<TextField
					label="Password"
					type="password"
					value={bufferPassword}
					onChange={(e) => setBufferPassword(e.target.value)}
					fullWidth
					margin="normal"
				/>
				<Box sx={{my:1}}>
					<Button variant="contained" onClick={handleUpdateProfile}>
						Update Profile
					</Button>
				</Box>
				<Box sx={{my:1}}>
					<Button variant="contained" onClick={logoutAllDevices} >
						Logout all Devices
					</Button>
				</Box>
				<Box sx={{my:1}}>
					<Button variant="contained" color="error" onClick={() => setIsDeleteModalOpen(true)}>
						Delete Account
					</Button>
				</Box>
			</Box>
            </Paper>
            <Modal open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
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
                }}>
					<Typography variant="body1">Are you sure you want to delete your account?</Typography>
					<Box mt={2}>
						<Button
							variant="contained"
							color="error"
							onClick={handleDeleteAccount}
							sx={{ marginRight: 2 }}
						>
							Delete
						</Button>
						<Button variant="outlined" onClick={() => setIsDeleteModalOpen(false)}>
							Cancel
						</Button>
					</Box>
				</Box>
			</Modal>
        </Box>
    )
}

export default Settings