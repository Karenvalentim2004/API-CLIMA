const express = require('express')
const axios = require('axios')
const cors = require('cors')

const app = express()
app.use(cors())

const API_KEY = ''

app.get('/clima', async (req, res) => {
    const cidade = req.query.cidade

    if (!cidade) {
        return res.status(400).json({ erro: "Cidade obrigatória" })
    }

    try {
        const response = await axios.get(
            `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(cidade)}&days=1&lang=pt`
        )

        const astro = response.data.forecast.forecastday[0].astro

        const dados = {
            cidade: response.data.location.name,
            dataHora: response.data.location.localtime,
            temperatura: response.data.current.temp_c,
            descricao: response.data.current.condition.text,
            nascerSol: astro.sunrise,
            porSol: astro.sunset,
            faseLua: astro.moon_phase,
        }

        res.json(dados)

    } catch (erro) {
        console.log(erro.response?.data || erro.message)

        res.status(500).json({
            erro: erro.response?.data?.error?.message || "Erro ao buscar clima"
        })
    }
})

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000")
})