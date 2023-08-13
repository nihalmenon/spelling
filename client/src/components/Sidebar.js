import React from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, Toolbar, Divider  } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import InboxIcon from '@mui/icons-material/Inbox';
import CasinoIcon from '@mui/icons-material/Casino'

const Sidebar = ({ mobileOpen, handleDrawerToggle, drawerWidth }) => {

	const drawer = (
		<>
		<Toolbar />
      	<Divider />
		<List sx={{ color: "text.lightBlue"}}>
			<ListItemButton sx={{
				'&:hover': { color: 'white', bgcolor: 'text.darkBlue' }
			}}>
				<ListItemIcon>
					<HomeIcon sx={{ color: 'text.lightBlue'}}/>
				</ListItemIcon>
				<ListItemText primary="Home" sx={{ fontSize: 'small' }} />
			</ListItemButton>
			<a href="/play" style={{ textDecoration: 'none', color: 'inherit' }}>
				<ListItemButton sx={{
					'&:hover': { color: 'white', bgcolor: 'text.darkBlue' }
				}}>
					<ListItemIcon>
						<CasinoIcon sx={{ color: 'text.lightBlue'}} />
					</ListItemIcon>
					<ListItemText primary="Play Now" sx={{ fontSize: 'small' }} />
				</ListItemButton>
			</a>
		</List>
		</>
	)

	const isMobile = useMediaQuery('(max-width:600px)')

	return (
		<>
		<Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
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
