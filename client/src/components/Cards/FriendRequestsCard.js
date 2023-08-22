import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, CardHeader, Button, ListItem } from '@mui/material';
import { User } from '../../datastructs'
import axios from '../../requests/axios';
import toast from 'react-hot-toast'

const FriendRequestsCard = ({ requestData, getData }) => {
  
    const MAX_DISPLAY_FRIENDS = 6
    const [displayedRequests, setDisplayedRequests] = useState([])

    const seeMore = () => {
        setDisplayedRequests(requestData);
    }
    
    useEffect(() => {
        setDisplayedRequests(requestData.slice(0, MAX_DISPLAY_FRIENDS))
    }, [requestData])

    const acceptUser = async (id) => {
      try {
        const authToken = localStorage.getItem('authToken')
        const response = await axios.post('/users/friends/accept', { id }, {
            headers: {
            'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.status === 200) {
            getData()
            toast.success('Accepted request!')
        }else{
            throw new Error(response.message)
        }
      } catch (e) {
        toast.error('Something went wrong!')
        console.log(e)
      }
      
    }

    const declineUser = async (id) => {
      try {
        const authToken = localStorage.getItem('authToken')
        const response = await axios.post('/users/friends/decline', { id }, {
            headers: {
            'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.status === 200) {
            getData()
            toast.success('Declined request!')
        }else{
            throw new Error(response.message)
        }
      } catch (e) {
        toast.error('Something went wrong!')
        console.log(e)
      }
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
        <CardHeader title="Friend Requests" sx={{ borderBottom: '1px solid #f0f0f0', color: 'primary.main' }} />
        <CardContent>
          {displayedRequests.length <= 0 ? <Typography variant='body1'>No current pending friend requests.</Typography>: displayedRequests.map((request) => (
              <ListItem key={request._id} sx={{display:'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 0,
                flexDirection: 'column',
                '@media (min-width:600px)': { flexDirection: 'row' }
              }}>
                <Typography variant="body1">{request.email}</Typography>
                <div>
                  <Button variant="text" onClick={() => acceptUser(request._id)}>Accept</Button>
                  <Button variant="text" onClick={() => declineUser(request._id)}>Decline</Button>
                </div>
              </ListItem>
          ))}
          {requestData && requestData.length > MAX_DISPLAY_FRIENDS && displayedRequests.length < requestData.length && (
            <Button variant="outlined" onClick={seeMore}>
              See More
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };
export default FriendRequestsCard;
