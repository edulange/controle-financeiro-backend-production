const mongoose = require('mongoose')

const despesaSchema = new mongoose.Schema({
	dia: { type: String, required: true },
	valor: { type: Number, required: true },
	observacao: { type: String },
	categoria: { type: String},
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
})

// Definir o formato desejado ao serializar para JSON
despesaSchema.set('toJSON', {
	transform: function (doc, ret) {
		// tirei essa merda pq eu tive que enviar uma string invés de data.
		// ret.dia = ret.dia.toLocaleDateString(); // Ajuste para formatar como DD/MM/YYYY
		ret.id = ret._id.toString()
		delete ret._id
		delete ret.__v
	},
})

module.exports = mongoose.model('Despesa', despesaSchema)