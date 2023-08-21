import React from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, Toolbar, Divider, Typography, Box  } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import InboxIcon from '@mui/icons-material/Inbox';
import CasinoIcon from '@mui/icons-material/Casino';
import CreateIcon from '@mui/icons-material/Create';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import SettingsIcon from '@mui/icons-material/Settings';

const Sidebar = ({ mobileOpen, handleDrawerToggle, drawerWidth }) => {

	const drawer = (
		<>
		<Toolbar />
		<Box sx={{mx: 'auto', mb:1, mt:'-45px'}}>
			<Typography variant="h4" color="white">Spel.</Typography>
		</Box>
      	<Divider />
		<List sx={{ color: "text.lightBlue"}}>
			<a href="/app/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
				<ListItemButton sx={{
					'&:hover': { color: 'white', bgcolor: 'text.darkBlue' }
				}}>
					<ListItemIcon>
						<HomeIcon sx={{ color: 'text.lightBlue'}}/>
					</ListItemIcon>
					<ListItemText primary="Home" sx={{ fontSize: 'small' }} />
				</ListItemButton>
			</a>
			<a href="/app/play" style={{ textDecoration: 'none', color: 'inherit' }}>
				<ListItemButton sx={{
					'&:hover': { color: 'white', bgcolor: 'text.darkBlue' }
				}}>
					<ListItemIcon>
						<CasinoIcon sx={{ color: 'text.lightBlue'}} />
					</ListItemIcon>
					<ListItemText primary="Play Now" sx={{ fontSize: 'small' }} />
				</ListItemButton>
			</a>
			<a href="/app/room?form=create" style={{ textDecoration: 'none', color: 'inherit' }}>
				<ListItemButton sx={{
					'&:hover': { color: 'white', bgcolor: 'text.darkBlue' }
				}}>
					<ListItemIcon>
						<CreateIcon sx={{ color: 'text.lightBlue'}} />
					</ListItemIcon>
					<ListItemText primary="Create Room" sx={{ fontSize: 'small' }} />
				</ListItemButton>
			</a>
			<a href="/app/room?form=join" style={{ textDecoration: 'none', color: 'inherit' }}>
				<ListItemButton sx={{
					'&:hover': { color: 'white', bgcolor: 'text.darkBlue' }
				}}>
					<ListItemIcon>
						<HourglassTopIcon sx={{ color: 'text.lightBlue'}} />
					</ListItemIcon>
					<ListItemText primary="Join Room" sx={{ fontSize: 'small' }} />
				</ListItemButton>
			</a>
			<a href="/app/settings" style={{ textDecoration: 'none', color: 'inherit' }}>
				<ListItemButton sx={{
					'&:hover': { color: 'white', bgcolor: 'text.darkBlue' }
				}}>
					<ListItemIcon>
						<SettingsIcon sx={{ color: 'text.lightBlue'}}/>
					</ListItemIcon>
					<ListItemText primary="Settings" sx={{ fontSize: 'small' }} />
				</ListItemButton>
			</a>
		</List>
		</>
	)

	return (
		<>
		<Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: "primary.main", color: 'text.lightBlue' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: "primary.main" },
          }}
          open
        >
          {drawer}
        </Drawer>
		</>
	);
};

export default Sidebar;
