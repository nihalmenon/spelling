import { Button, Container, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

function Home() {

    return (
        <>
        <Container maxWidth={false} sx={{bgcolor:"primary.main", minHeight:'100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <Typography variant='h1' sx={{ textAlign: 'center', color: "secondary.main" }}>Spel.</Typography>
            <Typography variant='body1' sx={{ textAlign: 'center', color: "secondary.main", mt: 1 }}>Sharpen Your Spelling Skills and Conquer the Word Arena!</Typography>
            <box style={{ justifyContent: 'center', alignItems: 'center', display:'flex' }}>
                <Link href='/login'><Button sx={{ bgcolor:"secondary.main", color:"text.ternary", my:3, mx:1,'&:hover': { bgcolor: 'background.main', color: 'secondary.main' } }} variant='contained'>Login</Button></Link>
                <Link href='/signup'><Button sx={{ bgcolor:"secondary.main", color:"text.ternary", my:3, mx:1, '&:hover': { bgcolor: 'background.main', color: 'secondary.main'} }} variant='contained'>Sign up</Button></Link>
                <Link href='/app/quickgame'><Button sx={{ bgcolor:"secondary.main", color:"text.ternary", my:3, mx:1, '&:hover': { bgcolor: 'background.main', color: 'secondary.main'} }} variant='contained'>Play now</Button></Link>
            </box>
        </Container>
        <Footer />
        </>
    )
}

export default Home