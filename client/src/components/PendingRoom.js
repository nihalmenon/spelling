
import React, { useEffect, useState } from 'react';
import { TextField, Button, Box, Alert, Typography, Link } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom'
import { User } from '../datastructs';
import axios from 'axios'
import toast from 'react-hot-toast'


function PendingRoom () {
    const location = useLocation()
    const [roomInput, setRoomInput] = useState("")
    const [userData, setUserData] = useState({})
    const [formError, setFormError] = useState("")
    const [create, setCreate] = useState(true)
    const [join, setJoin] = useState(false)

    const navigate = useNavigate()
    
    useEffect(() => {
      getProfile()
      const queryParams = new URLSearchParams(location.search)
      const form = queryParams.get('form')
      if (form && form === 'join') {
        setJoin(true)
        setCreate(false)
      }
    }, [])

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
        setFormError(e.response.data.error);
        if (e.response.status === 401) {
          navigate('/login');
          toast.error('Please sign in!')
        }
      }
    }

    const toggleForm = () => {
        if (create) {
            setCreate(false)
            setJoin(true)
        }else{
            setJoin(true)
            setCreate(true)
        }
    }

    const validateInput = () => {
      if (roomInput === "") {
        toast.error('Input cannot be empty!')
        return false
      }
      return true
    }

    const createRoom = async () => {
        if (userData !== {}) {
          try {
            const authToken = localStorage.getItem('authToken')
            console.log(authToken)
            const response = await axios.post('http://localhost:3000/games/room/create', {}, {
              headers: {
                'Authorization': `Bearer ${authToken}`,
              },
            });
            if (response.status === 200) {
              navigate('/app/multiplayer?room=' + response.data.room)
            }
          } catch (e) {
            setFormError(e.response.data.error);
            if (e.response.status === 401) {
              navigate('/login');
              toast.error('Please sign in!')
            }
          }
        }
    }
    
    const joinRoom = () => {
        if (validateInput() === false) return
        navigate('/app/multiplayer?room=' + roomInput.trim())
    }

    return (
      <>
        {create && 
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            bgcolor: 'background.default',
          }}
        >
          <Box
            sx={{
              width: '400px',
              p: 4,
              bgcolor: '#fff',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
            }}
          >
            <Typography variant='h3' sx={{ textAlign: 'center' }}>Create Room</Typography>
            <Box sx={{ mx: 'auto', my: 2, width: 'fit-content' }}>
                <Button variant="contained" sx={{ bgcolor: 'primary.main' }} onClick={createRoom}>
                    Create Room
                </Button>
            </Box>
            <Typography variant='subtitle2' sx={{textAlign: 'center', color: 'text.grey'}}>Join a room <Link sx={{ cursor: 'pointer' }} onClick={toggleForm} >here</Link>.</Typography>
            {formError !== ''  &&
            (<Alert severity="error">
              {formError}
            </Alert>)
            }
          </Box>
        </Box>}
        {join && 
            <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '100vh',
              bgcolor: 'background.default',
            }}
          >
            <Box
              sx={{
                width: '400px',
                p: 4,
                bgcolor: '#fff',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
              }}
            >
              <Typography variant='h3' sx={{ textAlign: 'center' }}>Join Room</Typography>
              <TextField
                label="Room"
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value)}
                fullWidth
                sx={{my:1}}
              />
              <Box sx={{ mx: 'auto', my: 2, width: 'fit-content' }}>
                  <Button variant="contained" sx={{ bgcolor: 'primary.main' }} onClick={joinRoom}>
                      Join Room
                  </Button>
              </Box>
              <Typography variant='subtitle2' sx={{textAlign: 'center', color: 'text.grey'}}>Create a room <Link sx={{ cursor: 'pointer' }} onClick={toggleForm}>here</Link>.</Typography>
              {formError !== ''  &&
              (<Alert severity="error">
                {formError}
              </Alert>)
              }
            </Box>
          </Box>
        }
      </>
    );
}

export default PendingRoom;