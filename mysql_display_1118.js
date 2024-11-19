const express = require('express');
const app = express();
const mysql = require('mysql2');

// 创建数据库连接
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'dockertest1118_db',  // 修改这里
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '77447744dcl',
    database: process.env.DB_NAME || 'testdb'
});

// 静态文件服务
app.use(express.static('public'));

// 根路由处理CLEAR
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/mysql_display_1118.html');
});

// API 路由
app.get('/api/users', (req, res) => {
    connection.query('SELECT * FROM users', (error, results) => {
        if (error) {
            console.error('Database error:', error);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json(results);
    });
});

// 启动服务器
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`MySQL Display Server running on port ${PORT} - Started on 2024/11/18`);
});