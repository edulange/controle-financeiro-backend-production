const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Rota para eu conseguir enxergar todos os usuários

router.get('/', async (req, res) => {
	try {
		const users = await User.find({})
		res.status(200).json(users)
	} catch (error) {
		console.log('erro ao buscar usuários:', error)
		res.status(500).json({ error: 'Houve um erro ao tentar buscar os usuários' })
	}
})

// Rota para registrar um novo usuário
router.post('/register', async (req, res) => {
	try {
		const { username, password } = req.body
		const hashedPassword = await bcrypt.hash(password, 10)
		const user = new User({ username, password: hashedPassword })
		await user.save()
		res.status(201).json({ message: 'Usuário registrado com sucesso' })
	} catch (error) {
		console.error('Erro ao registrar usuário:', error)
		res.status(500).json({ error: 'Erro interno do servidor' })
	}
})

// Rota para fazer login
router.post('/login', async (req, res) => {
	try {
		const { username, password } = req.body
		const user = await User.findOne({ username })
		if (!user) {
			return res.status(400).json({ error: 'Usuário não encontrado' })
      //alterado status para 400, pq o 404 que estava, não é captado como um catch.
		}
		const validPassword = await bcrypt.compare(password, user.password)
		if (!validPassword) {
			return res.status(401).json({ error: 'Senha incorreta' })
		}
		const token = jwt.sign({ userId: user._id }, 'seu-token-secreto')
		res.status(200).json({ token })
	} catch (error) {
		console.error('Erro ao fazer login:', error)
		res.status(500).json({ error: 'Erro interno do servidor' })
	}
})

// Rota para obter informações do usuário autenticado
router.get('/me', async (req, res) => {
	try {
		const token = req.headers.authorization.split(' ')[1]
		const decodedToken = jwt.verify(token, 'seu-token-secreto')
		const user = await User.findById(decodedToken.userId)
		res.status(200).json(user)
	} catch (error) {
		console.error('Erro ao obter informações do usuário:', error)
		res.status(401).json({ error: 'Token inválido' })
	}
})

//Rota para limpar todos os usuários registrados
//precisa ser pelo postman, pois em site ele só faz HTTP GET.
router.delete('/clear', async (req, res) => {
	try {
		await User.deleteMany({})
		res.status(200).json({ message: 'Usuários apagados do banco de dados com sucesso!' })
	} catch (error) {
		console.log('erro ao limpar os usuários do banco de dado', error)
		res.status(500).json({ error: 'Erro ao tentar limpar os usuários' })
	}
})

module.exports = router
