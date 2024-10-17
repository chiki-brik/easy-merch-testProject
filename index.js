$(document).ready(function() {
    function Hero() {

    }
    // тут сделать наследование по перемещению / атаке?
    // changeTileSize???
    function Enemy() {

    }

    function Sword() {

    }
    // тут сделать наследование с пропаданием???
    function Potion() {

    }

    function Field() {
        this.width = 40;
        this.height = 24;
        this.tileSize = Math.round(1024 / this.width);
        this.rooms = [];
        this.horizontalPasses = [];
        this.verticalPasses = [];
    }

    Field.prototype.init = function() {
        var field = document.querySelector('.field');

        // изначально поле было 1024 х 640. Нацело не делятся на 40 и 24.. Поэтому сделала приближенные к этому размеры и поменяла размер плиточек изначальный 50 х 50 на 26 х 26.
        field.style.width = this.tileSize*this.width + 'px';
        field.style.height = this.tileSize*this.height + 'px';

        // проходы
        var numOfHorizontalPasses = Math.round(Math.random() * (5 - 3) + 3);
        for (var i = 0; i < numOfHorizontalPasses; i++) {
            do { // чтобы не повторялись и не стояли рядом
                var newValue = Math.round(Math.random() * (this.height - 1) + 1);
            } while (this.horizontalPasses.indexOf(newValue) >= 0 || this.horizontalPasses.indexOf(newValue + 1) >= 0 || this.horizontalPasses.indexOf(newValue - 1) >= 0);
            
            this.horizontalPasses.push(newValue);
        }
        console.log(this.horizontalPasses);

        var numOfVerticalPasses = Math.round(Math.random() * (5 - 3) + 3);
        for (var i = 0; i < numOfVerticalPasses; i++) {
            do {
                var newValue = Math.round(Math.random() * (this.width - 1) + 1);
            } while (this.verticalPasses.indexOf(newValue) >= 0 || this.verticalPasses.indexOf(newValue + 1) >= 0 || this.verticalPasses.indexOf(newValue - 1) >= 0);

            this.verticalPasses.push(newValue);
        }
        console.log(this.verticalPasses);

        // комнаты
        var numOfRooms = Math.round(Math.random() * (10 - 5) + 5);
        for (var i = 0; i < numOfRooms; i++) {
            this.rooms.push({
                width: Math.round(Math.random() * (8 - 3) + 3),
                height: Math.round(Math.random() * (8 - 3) + 3)
            });
        }

        this.arrangeRooms();

        //заливаем все стеной, исключая проходы и комнаты
        for (var i = 0; i < this.height; i++) { // колонки field
            for (var j = 0; j < this.width; j++) { // строки field
                const newTile = document.createElement('div');
                newTile.classList.add('tile');
                // если прохода нет на этой клетке, то доабвляем класс стены
                if (this.horizontalPasses.indexOf(i + 1) < 0 && this.verticalPasses.indexOf(j + 1) < 0) newTile.classList.add('tileW');
                newTile.style.left = j * this.tileSize + 'px';
                newTile.style.top = i * this.tileSize + 'px';
                field.appendChild(newTile); 
            }
        }

        this.changeTileSize();
    }

    Field.prototype.changeTileSize = function() {
        $('.tile').css('width', this.tileSize + 'px');
        $('.tile').css('height', this.tileSize + 'px');
    }

    Field.prototype.arrangeRooms = function() {
        
    }

    Field.prototype.draw = function() {

    }

    function Game() {
        this.field = new Field;
    }

    Game.prototype.init = function() {
        this.field.init();
    }

    var game = new Game();
    game.init();

});