import React, { useState, useEffect } from 'react';
import { Paper, Box, IconButton, TextField, Button, CircularProgress, Alert, Link, Typography, MenuItem, Modal, Select } from '@mui/material';
import { VolumeUp, CheckCircleOutline } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatTime } from '../utils/'
import StatModal from './StatModal'
import WaitingRoom from './WaitingRoom';
import Leaderboard from './Leaderboard';
import MultiplayerStats from './MultiplayerStats';
import axios from 'axios';
import { User } from '../datastructs'
import toast from 'react-hot-toast'

import io from 'socket.io-client'
const socket = io.connect('http://localhost:3000')


function MultiplayerGame() {
    // waiting room
    const location = useLocation()
    const [loading, setLoading] = useState(true)
    const [room, setRoom] = useState('')
	const [profileLoading, setProfileLoading] = useState(true)
	const [userData, setUserData] = useState({})
    const [waitingRoom, setWaitingRoom] = useState(true)
    const [gameRoom, setGameRoom] = useState(false)
    const [isOwner, setIsOwner] = useState(false)
    const [duration, setDuration] = useState(120)
    const [gameStartModal, setGameStartModal] = useState(false)
    const [players, setPlayers] = useState([])
    // game
    const [time, setTime] = useState(duration)
    const [gameStarted, setGameStarted] = useState(false)
    const [word, setWord] = useState({})
	const [wordList, setWordList] = useState([])
	const [prevWord, setPrevWord] = useState({})
	const [isCorrect, setIsCorrect] = useState(null)
    const [wordCount, setWordCount] = useState(-1)
    const [input, setInput] = useState("")
    const [leaderboard, setLeaderboard] = useState([])
    const [stats, setStats] = useState({ correctWords: [], incorrectWords: []})
    const [gameFinished, setGameFinished] = useState(false)
	const [showStats, setShowStats] = useState(false)


    const navigate = useNavigate();

	useEffect(() => {
        getData()
	}, [])

    useEffect(() => {
        socket.on('update_players', (players) => {
            setPlayers(players)
        })
        socket.on('error', () => {
            toast.error('Something went wrong!')
        })
        socket.on('multiplayer_game_started', (words) => {
            receiveGameStart(words)
        })
        socket.on('timer_update', ({timeRemaining, id}) => {
            setTime(timeRemaining)
        })
        socket.on('error', (error) => {
			toast.error(error)
		})
        socket.on('update_leaderboard', (res) => {
            setLeaderboard(res)
        })
        socket.on('update_words', (res) => {
            setWordList(res)
        })
        socket.on('game_over', () => {
			socket.emit('multiplayer_game_stats', ({ stats, error }) => {
				if (error) {
					return toast.error('Something went wrong!')
				}
                console.log(stats)
				setStats(stats)
				handleFinishGame()
			})
		})
    }, [socket])

    useEffect(() => {
        setTime(duration)
    }, [duration])

    const getData = async () => {
        const profile = await getProfile()
        const queryParams = new URLSearchParams(location.search)
        const roomParam = queryParams.get('room')
        setRoom(roomParam)
        if (profile) joinRoom(roomParam, profile._id, profile.name)
    }

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
                return new User(response.data)
			}
		} catch (e) {
			console.log(e)
			if (e.response.status === 401) {
				navigate('/login')
			}
		}
	}

    const joinRoom = (roomName, id, name) => {
        socket.emit('join_room', {playerId: id, room: roomName, name }, ({error, owner}) => {
            if (error) {
                toast.error(`Room ${roomName} doesn't exist!`)
                return navigate('/app/room?form=join')
            }
            setIsOwner(owner)
        })
    }

    const toggleGameStartModal = () => {
        setGameStartModal(!gameStartModal)
    }

    const handleChangeDuration = (e) => {
		setDuration(parseInt(e.target.value))
	}

    const handleStartGame = () => {
        setLoading(true)
        setGameStartModal(false)
        if (userData === {} || room === '') return
        socket.emit('multiplayer_game_start', { room, playerId: userData._id, duration }, (error) => {
            setLoading(false)
            if (error) return toast.error('Something went wrong!')
            setWaitingRoom(false)
            setGameRoom(true)
            setGameStarted(true)
        })
    }

    const receiveGameStart = (words) => {
        if (gameStarted === false) {
            setWaitingRoom(false)
            setGameRoom(true)
            setLoading(false)
            setGameStarted(true)
        }
        setWordList(words)
        setWordCount(0)
    }

    useEffect(() => {
		setWord(wordList[wordCount])
		if (wordCount === wordList.length - 2) getMoreWords()
	}, [wordCount])

    useEffect(() => {
		if (gameStarted === true && gameFinished === false) speak('word')
	}, [word])

    const getMoreWords = () => {
        socket.emit('get_more_words', { room }, (res) => {
            setWordList(res)
        })
    }

    const speak = (topic) => {
		const topics = ['word', 'definition', 'sentence', 'partOfSpeech']
        if (!word || !topics.includes(topic)) {
			return;
		}
		const utterance = new SpeechSynthesisUtterance(word[topic])
		speechSynthesis.speak(utterance)
    }

    const inputHandler = (e) => {
		setInput(e.target.value)
	}

    const handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			checkSpelling()
		}
	}

    const checkSpelling = () => {
		if (input.trim() === word['word']) {
			setIsCorrect(true)
		}else{
			setIsCorrect(false)
		}
		socket.emit('multiplayer_submit_word', {room, input, word}, () => {})
		setInput('')
		setPrevWord(word)
		setWordCount(count => count+1)
	}

    const handleFinishGame = () => {
		setGameFinished(true)
		setShowStats(true)
		if (gameFinished === false) toast.success('Game finished!')
	}

    return (
        <>
        {!profileLoading && waitingRoom && (
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
            <WaitingRoom room={room} userData={userData} isOwner={isOwner} duration={duration} handleChangeDuration={handleChangeDuration} profileLoading={profileLoading} handleStartGame={handleStartGame} players={players} toggleGameStartModal={toggleGameStartModal} gameStartModal={gameStartModal}/>
        </Box>
        )} 
        {!profileLoading && gameRoom && gameFinished === false && (
                <>
                <div style={{
                    // height: '50px',
                    paddingTop: '20px',
                    width:'100%',
                    margin: '0 auto'
                }}>
                    <Typography variant='h1' sx={{textAlign:'center', color:'text.secondary'}}>{formatTime(time)}</Typography>
                </div>
                <Box sx={{ display: 'flex', bgcolor: 'background.default', maxWidth: '350px', margin: '20px auto'}}>
                    <Leaderboard leaderboard={leaderboard} />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'text.ternary',
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
                </>
            )}
            {gameFinished && showStats && (
                <MultiplayerStats stats={stats}/>
            )}
        </>
    )
}

export default MultiplayerGame