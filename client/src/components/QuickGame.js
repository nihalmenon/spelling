import React, { useState, useEffect } from 'react';
import { Paper, Box, IconButton, TextField, Button, CircularProgress, Alert, Link, Typography, Select, MenuItem, Modal, List, ListItem, ListItemText, Breadcrumbs } from '@mui/material';
import { VolumeUp, CheckCircleOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { formatTime } from '../utils/'
import axios from '../requests/axios';
import toast from 'react-hot-toast';
import StatModal from './StatModal'


function QuickGame() {
	const [gameStartModal, setGameStartModal] = useState(true)
	const [gameStarted, setGameStarted] = useState(false)
	const [game, setGame] = useState({})
	const [duration, setDuration] = useState(120)
    const [loading, setLoading] = useState(false)
	const [word, setWord] = useState({})
	const [prevWord, setPrevWord] = useState({})
	const [wordList, setWordList] = useState([])
	const [wordCount, setWordCount] = useState(-1)
	const [input, setInput] = useState("")
	const [isCorrect, setIsCorrect] = useState(null)
	const [correctWords, setCorrectWords] = useState([])
	const [incorrectWords, setIncorrectWords] = useState([])
	const [score, setScore] = useState(0)
	const [time, setTime] = useState(duration)
	const [gameFinished, setGameFinished] = useState(false)
	const [showStatModal, setShowStatModal] = useState(false)

	const navigate = useNavigate();

	useEffect(() => {
		setLoading(true)
		getWords()
	}, [])

	// start of game
	const handleChangeDuration = (e) => {
		setDuration(parseInt(e.target.value, 10));
	}

	const handleStartGame = () => {
		setGameStartModal(false)
		setTime(duration)
		setGameStarted(true)
	}	

	useEffect(() => {
		if (time === 0 && gameFinished === false) {
			setGameFinished(true)
		}
	}, [time])

	useEffect(() => {
		if (gameStarted === false) return

		speak('word')

		const timer = setInterval(() => {
			setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
		}, 1000)

		return () => clearInterval(timer)
    }, [gameStarted])

	const getWords = async () => {
		const response = await axios.get('/words/quick')
		if (response.status === 200) {
			setWordList(response.data)
			setWordCount(0)
		}else{
			navigate('/error')
			toast.error('Something went wrong!')
		}

		setLoading(false)
	}

	useEffect(() => {
		if (wordList.length > 0) {
			setWord(wordList[wordCount])
		}
	}, [wordCount])

	useEffect(() => {
		if (gameStarted === true && gameFinished === false) speak('word')
	}, [word])

	useEffect(() => {
		if (gameFinished === true) {
			setShowStatModal(true)
		}
	}, [gameFinished])

	const inputHandler = (e) => {
		setInput(e.target.value)
	}

	const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			checkSpelling()
		}
	}

    const speak = (topic) => {
		const topics = ['word', 'definition', 'sentence', 'partOfSpeech']
        if (!word || !topics.includes(topic)) {
			return;
		}
		const utterance = new SpeechSynthesisUtterance(word[topic])
		speechSynthesis.speak(utterance)
    }

	const checkSpelling = () => {
		if (input.trim() == word['word']) {
			setIsCorrect(true)
			setCorrectWords(prev => [...prev, word])
			setScore(prev => prev + 1)
		}else{
			setIsCorrect(false)
			setIncorrectWords(prev => [...prev, word])
			setScore(prev => prev - 1)
		}
		setInput('')
		setPrevWord(word)
		setWordCount(count => count+1)
	}

	useEffect(() => {
		if (gameFinished == true) {
			handleFinishGame()
		}
	}, [gameFinished])

	const handleFinishGame = () => {
		setShowStatModal(true)
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
					{word['definition'] ? <Link component="button" sx={{ my:1 }} onClick={() => speak('definition')}>Definition</Link> : null}
					{word['partOfSpeech'] ? <><br/><Link component="button" sx={{ my:1 }} onClick={() => speak('partOfSpeech')}>Part of Speech</Link></>: null}
					{word['sentence'] ? <><br/><Link component="button" sx={{ my:1 }} onClick={() => speak('sentence')}>Sentence</Link></>: null}
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
						<Typography variant="h5" gutterBottom sx={{}}>
							Spelling Game Options
						</Typography>
						<Typography variant="body2" color="text.grey">This is QuickGame mode. <Link href="/login">Log in</Link> to save results!</Typography>
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
							<Button variant="contained" color="primary" onClick={handleStartGame}>
								Start Game
							</Button>
						</Box>
					</div>
			</Box>
		</Modal>
		<StatModal showStatModal={showStatModal} setShowStatModal={setShowStatModal} stats={{correctWords, incorrectWords, score}}/>
		</>
	);
};

export default QuickGame;
