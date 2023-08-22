import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const Leaderboard = ({ leaderboard }) => {
	return (
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Rank</TableCell>
						<TableCell>Player</TableCell>
						<TableCell>Score</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{leaderboard.slice(0,5).map((player, index) => (
						<TableRow key={player.playerId}>
							<TableCell>{index + 1}</TableCell>
							<TableCell>{player.name}</TableCell>
							<TableCell>{player.score}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default Leaderboard;
