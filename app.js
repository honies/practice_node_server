const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json());

// GET запрос для получения всех пользователей
app.get('/users', (req, res) => {
  fs.readFile('users.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Ошибка сервера');
      return;
    }
    const users = JSON.parse(data);
    res.json(users);
  });
});

// GET запрос для получения пользователя по ID
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  fs.readFile('users.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Ошибка сервера');
      return;
    }
    const users = JSON.parse(data);
    const user = users.find(u => u.id === userId);
    if (!user) {
      res.status(404).send('Пользователь не найден');
      return;
    }
    res.json(user);
  });
});

// POST запрос для создания нового пользователя
app.post('/users', (req, res) => {
  const { id, name, email } = req.body;
  const post = {
    id,
    name,
    email
  };
  fs.readFile('users.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Ошибка сервера');
      return;
    }
    const users = JSON.parse(data);
    users.push(post);
    fs.writeFile('users.json', JSON.stringify(users), err => {
      if (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
        return;
      }
      res.send('Пользователь успешно создан');
    });
  });
});

// PUT запрос для обновления информации о пользователе
app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const updatedUser = req.body;
  fs.readFile('users.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Ошибка сервера');
      return;
    }
    const users = JSON.parse(data);
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      res.status(404).send('Пользователь не найден');
      return;
    }
    users[userIndex] = updatedUser;
    fs.writeFile('users.json', JSON.stringify(users), err => {
      if (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
        return;
      }
      res.send('Информация о пользователе успешно обновлена');
    });
  });
});

// DELETE запрос для удаления пользователя
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  fs.readFile('users.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Ошибка сервера');
      return;
    }
    const users = JSON.parse(data);
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      res.status(404).send('Пользователь не найден');
      return;
    }
    users.splice(userIndex, 1);
    fs.writeFile('users.json', JSON.stringify(users), err => {
      if (err) {
        console.error(err);
        res.status(500).send('Ошибка сервера');
        return;
      }
      res.send('Пользователь успешно удален');
    });
  });
});


app.listen(3000, () => {
  console.log('Сервер запущен на порту 3000');
});