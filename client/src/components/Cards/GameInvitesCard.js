import React, { useEffect, useState } from 'react'
import { Card, CardContent, Typography, Box, CardHeader, Button, ListItem } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { User } from '../../datastructs'
import axios from 'axios';
import toast from 'react-hot-toast'

const GameInvitesCard = ({ inviteData }) => {
    const navigate = useNavigate()
    const MAX_DISPLAY_GAMES = 6
    const [displayedInvites, setDisplayedInvites] = useState([])

    const seeMore = () => {
        setDisplayedInvites(inviteData);
    }
    
    useEffect(() => {
        setDisplayedInvites(inviteData.slice(0, MAX_DISPLAY_GAMES))
    }, [inviteData])

   const joinRoom = (room) => {
        navigate('/app/profile/multiplayer?room=' + room)
   }

    return (
      <Card sx={{ 
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        backgroundColor: 'white',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        color: 'text.grey' 
        }}>
        <CardHeader title="Game Invites" sx={{ borderBottom: '1px solid #f0f0f0', color: 'primary.main' }} />
        <CardContent>
          {displayedInvites.length <= 0 ? <Typography variant='body1'>No current pending game invites.</Typography>: displayedInvites.map((invite) => (
              <ListItem key={invite._id} sx={{display:'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 0,
                flexDirection: 'column',
                '@media (min-width:600px)': { flexDirection: 'row' }
              }}>
                <Typography variant="body1">{invite.email}</Typography>
                <div>
                  <Button variant="text" onClick={() => joinRoom(invite.room)}>Join</Button>
                </div>
              </ListItem>
          ))}
          {inviteData && inviteData.length > MAX_DISPLAY_GAMES && displayedInvites.length < inviteData.length && (
            <Button variant="outlined" onClick={seeMore}>
              See More
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };
export default GameInvitesCard;
