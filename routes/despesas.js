const express = require('express')
const Despesa = require('../models/despesa')

const router = express.Router()

// Rota para obter todas as despesas
router.get('/', async (request, response) => {
	try {
        const despesas = await Despesa.find().populate('createdBy');
		response.setHeader('Content-Type', 'application/json')
		response.json(despesas)
	} catch (error) {
		console.error('Erro na consulta ao MongoDB:', error)
		response.status(500).json({ error: 'Erro interno do servidor' })
	}
})

// Rota para criar uma nova despesa
router.post('/', async (request, response) => {
	try {
		console.log(request.body)
		const novaDespesa = new Despesa({
			dia: request.body.dia,
			valor: request.body.valor,
			observacao: request.body.observacao,
			categoria: request.body.categoria,
			createdBy: request.body.createdBy
		})

		// Salvar a nova despesa no banco de dados
		await novaDespesa.save()

		// Responder com uma mensagem de sucesso ou a despesa criada
		response.status(201).json({ message: 'Despesa criada com sucesso', data: novaDespesa })
	} catch (error) {
		console.error('Erro ao criar despesa:', error)
		response.status(500).json({ error: 'Erro interno do servidor' })
	}
})

router.delete('/:despesaId', async (req, res) => {
	try {
		const despesaId = req.params.despesaId

		// Execute a lógica para excluir a despesa no banco de dados
		await Despesa.findByIdAndDelete(despesaId)

		res.status(200).json({ message: 'Despesa excluída com sucesso' })
	} catch (error) {
		console.error('Erro ao excluir despesa:', error)
		res.status(500).json({ error: 'Erro ao excluir despesa' })
	}
})

module.exports = router
