import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Alert, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom'
import axios from '../requests/axios'
import toast from 'react-hot-toast'

function Login() {
  const [formSuccess, setFormSuccess] = useState('')
  const [formError, setFormError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    getProfile() // check if already logged in
  }, [])

  const getProfile = async () => {
		try {
			const authToken = localStorage.getItem('authToken')
			const response = await axios.get('/users/me', {
				headers: {
					'Authorization': `Bearer ${authToken}`,
				},
			});
			if (response.status === 200) {
        navigate('/app/profile')
        toast.success('Already logged in!')
			}
		} catch (e) {
		}
	}


  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    setFormError('')
    setFormSuccess('')
    try {
        const response = await axios.post('/users/login', {
          email,
          password
        });
        
        if (response.status === 200) {
          const authToken = response.data.token
          localStorage.setItem('authToken', authToken)
          navigate('/app/profile')
          toast.success('Logged in!')
        }else{
          throw new Error(response.data)
        }
    } catch (e) {
        console.log(e)
    }
  }

  const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			handleSubmit()
		}
	}

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'primary.main',
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '400px',
          p: 4,
          bgcolor: '#fff',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
        }}
      >
        <h1>Login</h1>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          sx={{my:1}}
          onKeyDown={handleKeyPress}   
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          sx={{my:1}}
          onKeyDown={handleKeyPress}   
        />
        <Box sx={{ mx: 'auto', my: 2, width: 'fit-content' }}>
            <Button variant="contained" sx={{ bgcolor: 'primary.main' }} type="submit">
                Login
            </Button>
        </Box>
        <Typography variant='subtitle2' sx={{textAlign: 'center', color: 'text.grey'}}>Don't have an account? Sign up <Link href="/signup">here</Link>.</Typography>
        {formError === '' ? null : 
        (<Alert severity="error">
          {formError}
        </Alert>)
        }
        {formSuccess === '' ? null : 
        (<Alert severity="success">
          {formSuccess}
        </Alert>)
        }
      </Box>
    </Box>
  );
}

export default Login;
