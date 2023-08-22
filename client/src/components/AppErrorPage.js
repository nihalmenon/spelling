import { Button, Container, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function AppErrorPage() {
    const navigate = useNavigate()

    useEffect(() => {
        navigate('/error')
    }, [])

    return (
        <></>
    )
}

export default AppErrorPage