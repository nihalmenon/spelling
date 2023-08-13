import { Button, Container, Typography, Link } from '@mui/material';

function ErrorPage() {
    return (
        <Container maxWidth={false} sx={{bgcolor:"primary.main", minHeight:'100vh'}}>
            <Typography variant='h1' sx={{ textAlign: 'center', color: "text.primary" }}>404 Error.</Typography>
        </Container>
    )
}

export default ErrorPage