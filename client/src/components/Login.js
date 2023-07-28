import React, { useState } from 'react';
import { TextField, Button, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Login() {
  const [formSuccess, setFormSuccess] = useState('')
  const [formError, setFormError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setFormSuccess('')
    try {
        const response = await axios.post('http://localhost:3000/users/login', {
          email,
          password
        });
        
        if (response.status === 200) {
          const authToken = response.data.token
          localStorage.setItem('authToken', authToken)
          setFormSuccess('Logged in. Redirecting...')
          setTimeout(() => {
            navigate('/profile')
          },1000)
          
        }else{
          throw new Error(response.data)
        }
    } catch (e) {
        console.log(e)
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
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
                Login
            </Button>
        </Box>
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
