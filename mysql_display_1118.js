const express = require('express');
const app = express();
const mysql = require('mysql2');
const path = require('path');

app.use(express.static('public'));

app.use((req, res, next) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    next();
});

// 创建数据库连接池而不是单个连接
const pool = mysql.createPool({
    host: 'dockertest1118_db',
    user: 'root',
    password: '77447744dcl',
    database: 'testdb',
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// 在文件开头添加
const INSTANCE_ID = process.env.HOSTNAME || 'unknown';

// 根路由处理
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'mysql_display_1118.html'));
});

// 获取所有用户列表
app.get('/api/users', (req, res) => {
    pool.query('SELECT * FROM users', (error, results) => {
        if (error) {
            console.error('Database error:', error);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json(results);
    });
});

// 获取用户详情
app.get('/api/user/:id', (req, res) => {
    const userId = req.params.id;
    pool.query(
        'SELECT id, name, email, phone, age, height, address, nationality, bio FROM users WHERE id = ?', 
        [userId], 
        (error, results) => {
            if (error) {
                console.error('Database error:', error);
                res.status(500).json({ error: 'Database error' });
                return;
            }
            if (results.length === 0) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.json(results[0]);
        }
    );
});

// 修改健康检查路由
app.get('/health', (req, res) => {
    // 为这个路由特别设置 Content-Type
    res.setHeader('Content-Type', 'application/json');
    
    pool.query('SELECT 1', (error) => {
        if (error) {
            res.status(500).json({ 
                status: 'error', 
                message: 'Database connection failed',
                instance: INSTANCE_ID 
            });
            return;
        }
        res.json({ 
            status: 'ok', 
            message: 'Service is healthy',
            instance: INSTANCE_ID
        });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} - Started on 2024/11/18`);
});

// 优雅关闭
process.on('SIGTERM', () => {
    pool.end((err) => {
        if (err) {
            console.error('Error closing pool:', err);
        }
        process.exit(0);
    });
});