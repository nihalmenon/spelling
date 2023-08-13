import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, List, ListItem, ListItemText } from '@mui/material';
import { getWordsAsString } from '../utils/'

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
								<ListItemText primary="Correct Words" secondary={stats && `${stats.correctWords.length}/${stats.correctWords.length + stats.incorrectWords.length}`} />
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
					</Box>
					</div>
			</Box>
		</Modal>
    )
}

export default StatModal