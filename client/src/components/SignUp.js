import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Alert, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom'
import axios from '../requests/axios'
import toast from 'react-hot-toast'

function SignUp() {
  const [formSuccess, setFormSuccess] = useState('')
  const [formError, setFormError] = useState('')
  const [name, setName] = useState('')
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
    e.preventDefault()
    setFormError('')
    setFormSuccess('')
    try {
        const response = await axios.post('/users', {
            email,
            password,
            name
        });
        
        if (response.status === 201) {
            const authToken = response.data.token
            localStorage.setItem('authToken', authToken)
            navigate('/app/profile')
            toast.success('Created an account!')
        }else{
            throw new Error(response.message)
        }
    } catch (e) {
        setFormError(e.response.data.message)
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'primary.main'
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
        <h1>Sign Up</h1>
        <TextField
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            sx={{my:1}}
        >

        </TextField>
        <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            sx={{my:1}}
        />
        <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            sx={{my:1}}
        />
        <Box sx={{ mx: 'auto', my: 2, width: 'fit-content' }}>
            <Button variant="contained" sx={{ bgcolor: 'primary.main' }} type="submit">
                Sign Up
            </Button>
        </Box>
        <Typography variant='subtitle2' sx={{textAlign: 'center', color: 'text.grey'}}>Already have an account? Log in <Link href="/login">here</Link>.</Typography>
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

export default SignUp;
