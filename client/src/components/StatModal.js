import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, List, ListItem, ListItemText, ListItemButton, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { getWordsAsString } from '../utils/';

function StatModal({ showStatModal, setShowStatModal, stats }) {
	
    return (
        <Modal open={showStatModal}>
			<Box
				sx={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					backgroundColor: 'background.paper',
					boxShadow: 24,
					p: 4,
					borderRadius: 8,
					width: '300px'
				}}
			>
					<div >
					<Typography variant="h5">Spelling Game Stats</Typography>
					<Box mt={2}>
						<List>
							<ListItem>
								<ListItemText primary="Score" secondary={stats && `${stats.score}`} />
								<Tooltip
									title={
									<Typography sx={{fontSize:'14px'}}>
										+1 for correct spellings, -1 for incorrect spellings
									</Typography>
									}
								>
									<InfoIcon color="primary" />
								</Tooltip>
							</ListItem>
							<ListItem>
								<ListItemText primary="Ratio" secondary={stats && `${stats.correctWords.length}/${stats.correctWords.length + stats.incorrectWords.length}`} />
							</ListItem>
							<ListItem>
								<ListItemText primary="Correct Words List" secondary={stats && getWordsAsString(stats.correctWords)} />
							</ListItem>
							<ListItem>
								<ListItemText primary="Incorrect Words List" secondary={stats && getWordsAsString(stats.incorrectWords)} />
							</ListItem>
						</List>
					</Box>
					<Box display="flex" justifyContent="center" mt={3}>
                        <Button onClick={() => window.location.reload()}>Play new game</Button>
						<br/>
						<a href='/app/profile' style={{textDecoration:'none'}}><Button>Home Page</Button></a>
					</Box>
					</div>
			</Box>
		</Modal>
    )
}

export default StatModal