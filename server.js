var express = require('express');
var bodyParser = require('body-parser');

var Storage = function(argument) {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id+=1;
    return item;
};

Storage.prototype.delete = function(id) {
    var deletedItem = null;
    this.items.forEach(function(item, i) {
        if(item.id == id) deletedItem = this.items.splice(i,1);
    }, this); 
    return deletedItem;
};

Storage.prototype.update = function(obj) {
    var updatedItem = null;
    this.items.forEach(function(item, i) {
        if(item.id == obj.id) updatedItem = this.items.splice(i,1, obj);
    }, this); 
    return updatedItem;
};

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(req, res) {
    res.json(storage.items);
});

app.listen(process.env.PORT || 8080);

var jsonParser = bodyParser.json();

app.post('/items', jsonParser, function(req, res) {
    if(!req.body) {
        return res.sendStatus(400);
    }
    
    var item = storage.add(req.body.name);
    res.status(201).json(item);
});

app.delete('/items/:id', jsonParser, function(req, res) {
    if(!req.body) {
        return res.sendStatus(400);
    }
    
    var deletedItem = storage.delete(req.params.id);
    if( deletedItem != null ) res.status(200).json(deletedItem);
    else res.status(204).json({message: 'no item with that id'});
});

app.put('/items/:id', jsonParser, function(req, res) {
    if(!req.body) {
        return res.sendStatus(400);
    }
    
    var updatedItem = storage.update(req.body);
    if( updatedItem != null ) res.status(200).json(updatedItem);
    else {
        updatedItem = storage.add(req.body.name);
        res.status(201).json(updatedItem);
    }
});