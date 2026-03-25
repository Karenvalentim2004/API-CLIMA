require('dotenv').config()

const express = require('express')
const axios = require('axios')
const cors = require('cors')

const app = express()

const traduzirLua = {
    "New Moon": "Lua nova",
    "Waxing Crescent": "Crescente",
    "First Quarter": "Quarto Crescente",
    "Waxing Gibbous": "Entre Crescente e Cheia",
    "Full Moon": "Lua Cheia",
    "Waning Gibbous": "Lua começando a minguar",
    "Last Quarter": "Quarto Minguante",
    "Waning Crescent": "Lua minguante"
}

app.use(cors())

const API_KEY = process.env.API_KEY

app.get('/clima', async (req, res) => {
    const cidade = req.query.cidade

    if (!cidade) {
        return res.status(400).json({ erro: "Cidade obrigatória" })
    }

    try {
        const response = await axios.get(
            `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(cidade)}&days=7&lang=pt`
        )

        const forecast = response.data.forecast.forecastday.map(dia => ({
            data: dia.date,
            max: dia.day.maxtemp_c,
            min: dia.day.mintemp_c,
            descricao: dia.day.condition.text,
            nascerSol: dia.astro.sunrise,
            porSol: dia.astro.sunset,
            faseLua: traduzirLua[dia.astro.moon_phase]
        }))

        const dados = {
            cidade: response.data.location.name,
            dataHora: response.data.location.localtime,
            temperaturaAtual: response.data.current.temp_c,
            descricaoAtual: response.data.current.condition.text,
            previsao: forecast
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