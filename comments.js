// Create web server with express
const express = require('express');
const app = express();
const port = 3000;
// Create server
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
// Create socket
const io = require('socket.io')(server);
// Use public folder
app.use(express.static('public'));
// Use body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
// Use mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/commentDB', { useNewUrlParser: true, useUnifiedTopology: true });
// Create schema
const commentSchema = new mongoose.Schema({
    name: String,
    comment: String
});
// Create model
const Comment = mongoose.model('Comment', commentSchema);
// Get all comments
app.get('/comments', (req, res) => {
    Comment.find({}, (err, comments) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(comments);
        }
    });
});
// Create comment
app.post('/comments', (req, res) => {
    const comment = new Comment({
        name: req.body.name,
        comment: req.body.comment
    });
    comment.save((err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Comment saved successfully');
        }
    });
    res.redirect('/');
});
// Socket connection
io.on('connection', (socket) => {
    console.log('Socket connection established');
    socket.on('comment', (data) => {
        io.sockets.emit('comment', data);
    });
});