import React, { useEffect, useState } from 'react';
import axios from '../../requests/axios';
import { Card, CardContent, Typography, Box, CardHeader, Button, ListItem, Modal, TextField, IconButton } from '@mui/material';
import { User } from '../../datastructs';
import CloseIcon from '@mui/icons-material/Close';
import toast from 'react-hot-toast';

const FriendsCard = ({ friendData }) => {
  const MAX_DISPLAY_FRIENDS = 3;
  const [displayedFriends, setDisplayedFriends] = useState([]);
  const [addFriendModal, setAddFriendModal] = useState(false);
  const [input, setInput] = useState('');

  const seeMore = () => {
    setDisplayedFriends(friendData);
  };

  const collapseList = () => {
    setDisplayedFriends(friendData.slice(0, MAX_DISPLAY_FRIENDS));
  };

  useEffect(() => {
    setDisplayedFriends(friendData.slice(0, MAX_DISPLAY_FRIENDS));
  }, [friendData]);

  const toggleAddFriendModal = () => {
    setAddFriendModal(!addFriendModal);
  };

  const addFriend = async () => {
    console.log(input);
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await axios.post(
        '/users/friends/add',
        { email: input },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 201) {
        toggleAddFriendModal();
        setInput('');
        return toast.success('Invite sent!');
      }

      throw new Error(response.data);
    } catch (e) {
      toast.error('Something went wrong!');
      console.log(e);
    }
  };

  return (
    <>
      <Card
        sx={{
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          borderRadius: '8px',
          backgroundColor: 'white',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          color: 'text.grey',
        }}
      >
        <CardHeader title="Friends" sx={{ borderBottom: '1px solid #f0f0f0', color: 'primary.main' }} />
        <CardContent>
          {displayedFriends.length <= 0 ? (
            <Typography variant="body1">Click "Add Friend" to add a new account as a friend.</Typography>
          ) : (
            displayedFriends.map((friend) => (
              <ListItem key={friend._id} sx={{ paddingLeft: 0 }}>
                <Typography variant="body1">
                  {friend.name} ({friend.email})
                </Typography>
              </ListItem>
            ))
          )}
          {friendData && friendData.length > MAX_DISPLAY_FRIENDS && (
            <>
              {displayedFriends.length === friendData.length ? (
                <Button variant="text" onClick={collapseList}>
                  Collapse
                </Button>
              ) : (
                <Button variant="text" onClick={seeMore}>
                  See More
                </Button>
              )}
            </>
          )}
          <Button sx={{ mt: 2 }} variant="contained" onClick={toggleAddFriendModal}>
            Add Friend
          </Button>
        </CardContent>
      </Card>
      <Modal open={addFriendModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: 8,
            width: '300px',
            padding: '16px',
            textAlign: 'center',
            outline: 'none',
          }}
        >
          <IconButton sx={{ position: 'absolute', top: '8px', right: '8px' }} onClick={toggleAddFriendModal}>
            <CloseIcon />
          </IconButton>
          <Typography variant="h5" sx={{ marginBottom: '16px' }}>
            Add Friend
          </Typography>
          <TextField
            label="Friend's Email"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            fullWidth
            sx={{ marginBottom: '16px' }}
          />
          <Button onClick={addFriend} variant="contained" color="primary">
            Add
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default FriendsCard;
