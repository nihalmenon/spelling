import React from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import InboxIcon from '@mui/icons-material/Inbox';
import CasinoIcon from '@mui/icons-material/Casino'

const Sidebar = () => {

	return (
		<Drawer
			variant="permanent"
            sx={{
                width: '140px'
            }}
		>
			<div />
			<List>
				<ListItemButton>
					<ListItemIcon>
						<HomeIcon />
					</ListItemIcon>
					<ListItemText primary="Home" sx={{fontSize: 'small'}}/>
				</ListItemButton>
				<ListItemButton>
					<ListItemIcon>
						<InboxIcon />
					</ListItemIcon>
					<ListItemText primary="Inbox" sx={{fontSize: 'small'}}/>
				</ListItemButton>
                <a href="/play" style={{textDecoration: "none", color: "inherit"}}>
                    <ListItemButton>
                        <ListItemIcon>
                            <CasinoIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Play Now" sx={{fontSize: 'small'}}/>
                    </ListItemButton>
                </a>
			</List>
		</Drawer>
	);
};

export default Sidebar;
