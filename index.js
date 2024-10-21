$(document).ready(function() {
    function Tile() {
        this.fieldWidth = 40;
        this.fieldHeight = 24;
        this.tileSize = Math.floor(1024 / this.fieldWidth);
        this.tilesForMovement = [];

        this.defineTilesForMovement
    }

    Tile.appearance = function(item, tileX, tileY, health) {
        var id = tileX + ' ' + tileY;
        var elem = document.getElementById(id);
        elem.classList.add(item);

        if (item === 'tileP') { 
            var healthElem = document.createElement('div');
            healthElem.classList.add('health');
            healthElem.style.width = health +'%';
            elem.appendChild(healthElem);
        }   
        
    }

    Tile.remove = function(item, tileX, tileY) {
        var id = tileX + ' ' + tileY;
        var elem = document.getElementById(id);
        elem.classList.remove(item);

        if (item === 'tileP') { 
            var health = elem.children[0];
            elem.removeChild(health);
        }   
    }

    function Character(className, startPosition, attackPower) {
        Tile.call(this);
        this.currentPositionX = +startPosition[0];
        this.currentPositionY = +startPosition[1];
        this.health = 100;
        this.attackPower = attackPower;
        this.className = className;
    }

    Character.prototype.move = function(direction) {

        switch(direction){
            case 'up': 
                console.log('move - up');
                console.log(this.tilesForMovement);
                if ((this.currentPositionY - 1 >= 1) && (this.tilesForMovement.indexOf(this.currentPositionX + ',' + (this.currentPositionY - 1)) >= 0)) {
                    Tile.remove(this.className, this.currentPositionX, this.currentPositionY);
                    Tile.appearance(this.className, this.currentPositionX, --this.currentPositionY, this.health);
                }
                break;
            case 'down': 
                console.log('move - down');
                console.log(this.currentPositionY);
                if ((this.currentPositionY + 1 <= this.fieldHeight)) {
                    Tile.remove(this.className, this.currentPositionX, this.currentPositionY);
                    Tile.appearance(this.className, this.currentPositionX, ++this.currentPositionY, this.health);
                }
                break;
            case 'left':
                if ((this.currentPositionX - 1 >= 1)) {
                    Tile.remove(this.className, this.currentPositionX, this.currentPositionY);
                    Tile.appearance(this.className, --this.currentPositionX, this.currentPositionY, this.health);
                }
                break;
            case 'right': 
                console.log('move - right');
                if ((this.currentPositionX + 1 <= this.fieldWidth)) {
                    Tile.remove(this.className, this.currentPositionX, this.currentPositionY);
                    Tile.appearance(this.className, ++this.currentPositionX, this.currentPositionY, this.health);
                }
                break;
        }
    }

    Character.prototype.attack = function(tileX, tileY) {
        
    }

    function Hero(startPosition, attackPower) {
        Character.call(this, startPosition, attackPower);
    }

    Hero.prototype.stepOnPotion = function() {
        this.health += 40;
    }

    Hero.prototype.stepOnSword = function() {
        this.attackPower += 15;
    }

    Hero.prototype = Object.create(Character.prototype);

    function Enemy(startPosition, attackPower) {
        Character.call(this, startPosition, attackPower);
    }

    Enemy.prototype = Object.create(Character.prototype);

    function Sword(positionX, positionY) {
        this.positionX = positionX;
        this.positionY = positionY
    }

    function Potion(positionX, positionY) {
        this.positionX = positionX;
        this.positionY = positionY
    }

    function Field() {
        Tile.call(this);

        this.squareSize = 8; // 8 - максимальный размер ширины / высоты комнаты
        this.squares = []; // разбиваем поле на квадраты
        this.rooms = [];
        this.horizontalPasses = [];
        this.verticalPasses = [];
    }

    Field.prototype.init = function() {
        var field = document.querySelector('.field');

        // изначально поле было 1024 х 640. Нацело не делятся на 40 и 24.. Поэтому сделала приближенные к этому размеры и поменяла размер плиточек изначальный 50 х 50 на 26 х 26.
        field.style.width = this.tileSize*this.fieldWidth + 'px';
        field.style.height = this.tileSize*this.fieldHeight + 'px';

        // делим поле на секции - квадраты
        for (var i = 1; i <= this.fieldWidth; i += this.squareSize) {
            for (var j = 1; j <= this.fieldHeight; j += this.squareSize) {
                this.squares.push({
                    topLeftX: i,
                    topLeftY: j,
                    hasRoom: false,
                    hasHorizontalPass: false,
                    hasVerticalPass: false
                });
            }
        }

        this.placePasses();
        // console.log(this.horizontalPasses);
        // console.log(this.verticalPasses);
        this.placeRooms();
        //console.log(this.rooms);

        //заливаем все стеной, исключая проходы
        for (var i = 0; i < this.fieldHeight; i++) { // колонки field
            for (var j = 0; j < this.fieldWidth; j++) { // строки field
                const newTile = document.createElement('div');
                newTile.classList.add('tile');
                newTile.id = (j + 1) + ' ' + (i + 1);
                // если прохода нет на этой клетке, то доабвляем класс стены
                if (this.horizontalPasses.indexOf(i + 1) < 0 && this.verticalPasses.indexOf(j + 1) < 0) newTile.classList.add('tileW');
                newTile.style.left = j * this.tileSize + 'px';
                newTile.style.top = i * this.tileSize + 'px';
                field.appendChild(newTile); 
            }
        }

        // исключаем комнаты
        this.rooms.forEach(item => {
            for (var i = 0; i < item.width; i++) {
                for (var j = 0; j < item.height; j++) {
                    var id = (item.topLeftX + i) + ' ' + (item.topLeftY + j);
                    var elem = document.getElementById(id);
                    elem.classList.remove('tileW');
                }
            }
        });

        this.defineTilesForMovement();
    }

    Field.prototype.changeTileSize = function() {
        $('.tile').css('width', this.tileSize + 'px');
        $('.tile').css('height', this.tileSize + 'px');
    }

    Field.prototype.placePasses = function() {

        // Math.floor(Math.random() * ((max - min) + 1) + min);
        var numOfHorizontalPasses = Math.floor(Math.random() * ((5 - 3) + 1) + 3);
        var numOfVerticalPasses = Math.floor(Math.random() * ((5 - 3) + 1) + 3);

        // распределяем горизонтальные проходы
        // проходимся по строкам квадратов, на которые мы разбили поле. 
        // Смотрим, чтобы в каждой строке был проход. 
        // Если проходов больше, чем 3 - рандомно распределяем, только, чтобы проходы не стояли рядом
        for(var i = 1; i <= numOfHorizontalPasses; i++) {
            var emptyRows = this.squares.filter(item => item.hasHorizontalPass === false);

            if (emptyRows.length === 0) { // распределяем рандомно
                do { // чтобы не повторялись и не стояли рядом
                    // Math.floor(Math.random() * ((max - min) + 1) + min);
                    var newValue = Math.floor(Math.random() * ((this.fieldHeight - 1) + 1) + 1);
                } while (this.horizontalPasses.indexOf(newValue) >= 0 || this.horizontalPasses.indexOf(newValue + 1) >= 0 || this.horizontalPasses.indexOf(newValue - 1) >= 0);
            } else {
                var minY = emptyRows[0].topLeftY;
                do { 
                    // Math.floor(Math.random() * ((max - min) + 1) + min);
                    var newValue = Math.floor(Math.random() * (((minY + this.squareSize - 1) - minY) + 1) + minY);
                } while (this.horizontalPasses.indexOf(newValue) >= 0 || this.horizontalPasses.indexOf(newValue + 1) >= 0 || this.horizontalPasses.indexOf(newValue - 1) >= 0);
                this.squares.forEach(item => {
                    if (item.topLeftY === minY) item.hasHorizontalPass = true;
                });
            }
            this.horizontalPasses.push(newValue);
        }

        // распределяем вертикальные проходы
        for(var i = 1; i <= numOfVerticalPasses; i++) {
            var emptyColumns = this.squares.filter(item => item.hasVerticalPass === false);

            // т.к. колонок всего 5 и максимум может быть 5 проходов => генерируем только в колонках, без рандомного распределения ( не как с вертикальными проходами )
            var minX = emptyColumns[0].topLeftX;

            do {
                // Math.floor(Math.random() * ((max - min) + 1) + min);
                var newValue = Math.floor(Math.random() * (((minX + this.squareSize - 1)- minX) + 1) + minX);
            } while (this.verticalPasses.indexOf(newValue) >= 0 || this.verticalPasses.indexOf(newValue + 1) >= 0 || this.verticalPasses.indexOf(newValue - 1) >= 0);

            this.squares.forEach(item => {
                if (item.topLeftX === minX) item.hasVerticalPass = true;
            });

            this.verticalPasses.push(newValue);
        }
    }

    Field.prototype.placeRooms = function() {

        // определеяем кол-во и размер комнат
        // Math.floor(Math.random() * ((max - min) + 1) + min);
        var numOfRooms = Math.floor(Math.random() * ((10 - 5) + 1) + 5);
        for (var i = 0; i < numOfRooms; i++) {
            this.rooms.push({
                width: Math.floor(Math.random() * ((8 - 3) + 1) + 3),
                height: Math.floor(Math.random() * ((8 - 3) + 1) + 3),
                topLeftX: 0,
                topLeftY: 0
            });
        }

        // смотрим среди квадратов, где нет комнат (проходы есть в каждом квадрате за счет горизонтальных)
        // выбираем рандомно квадрат
        // получаем координаты левого верхнего угла комнаты, чтобы было пересечение с прозодами
        // отмечаем выбранный квадрат занятым
        for (var i = 1; i <= numOfRooms; i++) {
            var freeSquares = this.squares.filter(item => !item.hasRoom);

            // Math.floor(Math.random() * ((max - min) + 1) + min);
            var chosenSquareIndex = Math.floor(Math.random() * (( (freeSquares.length - 1) - 0) + 1) + 0);

            var coordinates = this.placeRoomInSquare(freeSquares[chosenSquareIndex], this.rooms[i - 1].width, this.rooms[i - 1].height);

            this.rooms[i - 1].topLeftX = coordinates[0];
            this.rooms[i - 1].topLeftY = coordinates[1];
            freeSquares[chosenSquareIndex].hasRoom = true;
        }
    }

    Field.prototype.placeRoomInSquare = function (square, roomWidth, roomHeight) {

        // массив всех РАЗРЕШЕННЫХ для комнаты данного размера координат верхнего левого угла в данном квадрате
        var acceptableCoord = [];

        // ограничение на i & j, чтобы не было перехода за границы квадрата по Х и У
        for(var i = 0; i < (this.squareSize - roomWidth + 1); i++) {
            for(var j = 0; j < (this.squareSize - roomHeight + 1); j++) {
                var x = i + square.topLeftX,
                    y = j + square.topLeftY;
                
                var minX = square.topLeftX,
                    maxX = (minX + this.squareSize - 1) - roomWidth,
                    minY = square.topLeftY,
                    maxY = (minY + this.squareSize - 1) - roomHeight;

                var isIntersectWithPass = this.verticalPasses.filter(item => item >= minX && item <= (minX + this.squareSize - 1)).some((item) => (item >= x && item <= x + roomWidth - 1));

                if (!isIntersectWithPass) {
                    isIntersectWithPass = this.horizontalPasses.filter(item => item >= minY && item <= (minY + this.squareSize - 1)).some((item) => (item >= y && item <= y + roomHeight - 1));
                }

                if (isIntersectWithPass) acceptableCoord.push([x, y]);
            }
        }

        // Math.floor(Math.random() * ((max - min) + 1) + min);
        var coordIndex = Math.floor(Math.random() * (((acceptableCoord.length - 1) - 0) + 1) + 0);

        return acceptableCoord[coordIndex];
    }

    Field.prototype.defineTilesForMovement = function() {
        console.log(this.tilesForMovement);

        // заполняем вертикальными проходами
        this.verticalPasses.forEach(item => {
            for(var i = 1; i <= this.fieldHeight; i++) {
                this.tilesForMovement.push(item + ',' + i);
            }
        });

        // заполняем горизонтальными проходами
        this.horizontalPasses.forEach(item => {
            for(var j = 1; j <= this.fieldWidth; j++) {
                if (this.tilesForMovement.indexOf(j + ',' + item) < 0) this.tilesForMovement.push(j + ',' + item);
            }
        });

        // заполняем комнатами
        this.rooms.forEach(item => {
            for(var i = item.topLeftX; i <= item.topLeftX + item.width - 1; i++) {
                for(var j = item.topLeftY; j <= item.topLeftY + item.height - 1; j++) {
                    if (this.tilesForMovement.indexOf(i + ',' + j) < 0) this.tilesForMovement.push(i + ',' + j);
                }
            }
        });
        console.log(this.tilesForMovement);
    }

    function Game() {
        this.field = new Field;
        //this.hero = new Hero(startPosition, attackPower);
        //this.enemies = new Enemy();
        this.tilesWithPotion = [];
        this.tilesWithSword = [];
        //this.finish = false;
    }

    Game.prototype.placeElements = function() {
        var potionsNum = 10;
        var swordsNum = 2;
        var freeToPlaceTiles = this.field.tilesForMovement;

        for(var i = 1; i <= potionsNum; i++) {
            // Math.floor(Math.random() * ((max - min) + 1) + min);
            var placeTile = Math.floor(Math.random() * ((freeToPlaceTiles.length - 1 - 0) + 1) + 0);

            var coordNewPotion = freeToPlaceTiles[placeTile].split(',');
            Tile.appearance('tileHP', coordNewPotion[0], coordNewPotion[1]);

            this.tilesWithPotion.push(coordNewPotion);

            // убираем из вакантных клеточек
            freeToPlaceTiles.splice(placeTile, 1);
        }

        for(var i = 1; i <= swordsNum; i++) {
            // Math.floor(Math.random() * ((max - min) + 1) + min);
            var placeTile = Math.floor(Math.random() * ((freeToPlaceTiles.length - 1 - 0) + 1) + 0);

            var coordNewPotion = freeToPlaceTiles[placeTile].split(',');
            Tile.appearance('tileSW', coordNewPotion[0], coordNewPotion[1]);

            this.tilesWithSword.push(coordNewPotion);

            freeToPlaceTiles.splice(placeTile, 1);
        }

        // располагаем героя
        var placeHero = Math.floor(Math.random() * ((freeToPlaceTiles.length - 1 - 0) + 1) + 0);
        
        var coordHero = freeToPlaceTiles[placeHero].split(',');
        this.hero = new Hero('tileP', coordHero, 25);
        Tile.appearance('tileP', this.hero.currentPositionX, this.hero.currentPositionY, this.hero.health);
        freeToPlaceTiles.splice(placeHero, 1);
    }

    Game.prototype.init = function() {
        this.field.init(); // инициализируем карту

        this.placeElements(); // заполняем карту инвентарем и персонажами

        window.addEventListener('keydown', (e) => { // "слушаем" нажатия клавиш и двигаем героя
            switch(e.code) {
                case 'ArrowRight': this.hero.move('right'); break;
                case 'ArrowLeft': this.hero.move('left'); break;
                case 'ArrowUp': this.hero.move('up'); break;
                case 'ArrowDown': this.hero.move('down'); break;
                case 'Space': this.hero.attack(); break;
            }
        });

        this.field.changeTileSize();
    }

    var game = new Game();
    game.init();

});