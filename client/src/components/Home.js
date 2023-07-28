import { Button, Container, Typography, Link } from '@mui/material';

function Home() {
    return (
        <Container maxWidth={false} sx={{bgcolor:"primary.main", minHeight:'100vh'}}>
            <Typography variant='h1' sx={{ textAlign: 'center', color: "#222222" }}>Welcome to {'{'}insert name here{'}'}.</Typography>
            <box style={{ justifyContent: 'center', alignItems: 'center', display:'flex' }}>
                <Link href='/login'><Button sx={{ bgcolor:"secondary.main", color:"white", my:3, mx:1 }} variant='contained'>Login</Button></Link>
                <Link href='/signup'><Button sx={{ bgcolor:"secondary.main", color:"white", my:3, mx:1 }} variant='contained'>Sign up</Button></Link>
            </box>
        </Container>
    )
}

export default Home