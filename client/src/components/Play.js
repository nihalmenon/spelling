import React, { useState, useEffect } from 'react';
import { Paper, Box, IconButton, TextField, Button, CircularProgress, Alert, Link, Typography, MenuItem, Modal, Select } from '@mui/material';
import { VolumeUp, CheckCircleOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { formatTime } from '../utils/'
import StatModal from './StatModal'
import axios from 'axios';
import { User } from '../datastructs'
import toast from 'react-hot-toast'

import io from 'socket.io-client'
const socket = io.connect('http://localhost:3000')


function Play() {
	const [loading, setLoading] = useState(true)
	const [profileLoading, setProfileLoading] = useState(true)
	const [userData, setUserData] = useState({})
	const [gameStartModal, setGameStartModal] = useState(true)
	const [gameStarted, setGameStarted] = useState(false)
	const [duration, setDuration] = useState(120)
	const [showError, setShowError] = useState(false)
	const [time, setTime] = useState(duration)
	const [input, setInput] = useState("")
	const [word, setWord] = useState({})
	const [wordList, setWordList] = useState([])
	const [prevWord, setPrevWord] = useState({})
	const [isCorrect, setIsCorrect] = useState(null)
	const [stats, setStats] = useState({ correctWords: [], incorrectWords: []})
	const [wordCount, setWordCount] = useState(-1)
	const [gameFinished, setGameFinished] = useState(false)
	const [showStatModal, setShowStatModal] = useState(false)

	const navigate = useNavigate();

	useEffect(() => {
		getProfile()
	}, [])

	const getProfile = async () => {
		try {
			const authToken = localStorage.getItem('authToken')
			const response = await axios.get('http://localhost:3000/users/me', {
				headers: {
					'Authorization': `Bearer ${authToken}`,
				},
			});
			if (response.status === 200) {
				setUserData(new User(response.data))
				setProfileLoading(false)
			}
		} catch (e) {
			console.log(e)
			if (e.response.status === 401) {
				navigate('/login')
			}
		}
	}

	// select options for game

	const handleChangeDuration = (e) => {
		setDuration(parseInt(e.target.value))
	}

    const handleStartGame = () => {
		setGameStartModal(!gameStartModal)
		socket.emit('get_words', (words) => {
			setWordList(words)
			setWordCount(0)
		})
        socket.emit('game_start', { duration, playerId: userData._id, playerName: userData.name }, (error) => {

			if (error) {
				setShowError(true)
				return
			}

			setGameStarted(true)
			setLoading(false)
			toast.success('Game started!')
		})
    }

	// game started
	useEffect(() => {
		setWord(wordList[wordCount])
		if (wordCount === wordList.length - 2) getMoreWords()
	}, [wordCount])

	useEffect(() => {
		if (gameStarted === true && gameFinished === false) speak('word')
	}, [word])

	const inputHandler = (e) => {
		setInput(e.target.value)
	}

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			checkSpelling()
		}
	}
	
	const checkSpelling = () => {
		if (input.trim() == word['word']) {
			setIsCorrect(true)
		}else{
			setIsCorrect(false)
		}
		socket.emit('submit_word', {input, word}, () => {})
		setInput('')
		setPrevWord(word)
		setWordCount(count => count+1)
	}

	const speak = (topic) => {
		const topics = ['word', 'definition', 'sentence', 'partOfSpeech']
        if (!word || !topics.includes(topic)) {
			return;
		}
		const utterance = new SpeechSynthesisUtterance(word[topic])
		speechSynthesis.speak(utterance)
    }

	const getMoreWords = () => {
		socket.emit('get_words', (words) => {
			setWordList(prev => [...prev, ...words])
		})
	}

    useEffect(() => {
        socket.on('timer_update', (timeRemaining) => {
            setTime(timeRemaining)
        })

		socket.on('error', (error) => {
			toast.error(error)
		})

		socket.on('game_over', () => {
			socket.emit('game_stats', ({ stats, error }) => {
				console.log(stats)
				if (error) {
					return toast.error('Something went wrong!')
				}
				setStats(stats)
				handleFinishGame()
			})
		})

    }, [socket])

	const handleFinishGame = (stats) => {
		setGameFinished(true)
		setShowStatModal(true)
		if (gameFinished === false) toast.success('Game finished!')
	}

    return ( 
		<>
		<div style={{
			height: '50px',
			paddingTop: '20px',
			width:'100%',
			margin: '0 auto'
		}}>
			<Typography variant='h1' sx={{textAlign:'center', color:'text.secondary'}}>{formatTime(time)}</Typography>
		</div>
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				minHeight: '100vh',
				// bgcolor: 'primary.main',
				color: 'text.ternary'
			}}
		>
			<Paper sx={{ padding: '20px', maxWidth: '350px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px', backgroundColor: 'white', }}>
			{loading ? <CircularProgress/> : 
					<>
						<Box sx={{ display: 'flex', justifyContent: 'center' }}>
							<IconButton sx={{ mx: 'auto' }} onClick={() => speak('word')}>
								<VolumeUp />
							</IconButton>
						</Box>
						{word && word['definition'] ? <Link component="button" sx={{ my:1 }} onClick={() => speak('definition')}>Definition</Link> : null}
						{word && word['partOfSpeech'] ? <><br/><Link component="button" sx={{ my:1 }} onClick={() => speak('partOfSpeech')}>Part of Speech</Link></>: null}
						{word && word['sentence'] ? <><br/><Link component="button" sx={{ my:1 }} onClick={() => speak('sentence')}>Sentence</Link></>: null}
						<TextField label="Enter your text" fullWidth sx={{ my: 2 }} value={input} onChange={inputHandler} onKeyUp={handleKeyPress}/>
						<Button variant="contained" startIcon={<CheckCircleOutline />} fullWidth onClick={checkSpelling}>Submit</Button>
						{isCorrect === true && (
							<Alert severity="success" sx={{ my: 2 }}>
								Correct! Your answer is right.
							</Alert>
						)}
						{isCorrect === false && (
							<Alert severity="error" sx={{ my: 2 }}>
								Wrong: {prevWord['word']}.
							</Alert>
						)}
					</>
				}
			</Paper>
		</Box>
		<Modal open={gameStartModal}>
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
					width: '300px',
				}}
			>
					<div>
						<Typography variant="h5" gutterBottom>
							Spelling Game Options
						</Typography>
						<Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
							<Typography variant="h6">Duration:</Typography>
							<span>&emsp;</span>
							<Select value={duration} onChange={handleChangeDuration}>
								<MenuItem value={10}>10 seconds</MenuItem>
								<MenuItem value={60}>1 Minute</MenuItem>
								<MenuItem value={120}>2 Minutes</MenuItem>
								<MenuItem value={300}>5 Minutes</MenuItem>
							</Select>
						</Box>
						<Box mt={2} display="flex" justifyContent="flex-end">
							{!profileLoading && <Button variant="contained" color="primary" onClick={handleStartGame}>
								Start Game
							</Button>}
							{showError && <Alert severity='error'>Something went wrong!</Alert>}
						</Box>
					</div>
			</Box>
		</Modal>
		<StatModal showStatModal={showStatModal} setShowStatModal={setShowStatModal} stats={stats}/>
		</>
	);
}

export default Play;