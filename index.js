$(document).ready(function() {
    // сделать для tile появление / перемещение и на всех наследовать
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
        this.tileSize = Math.floor(1024 / this.width);
        this.squareSize = 8; // 8 - максимальный размер ширины / высоты комнаты
        this.squares = [];
        this.rooms = [];
        this.horizontalPasses = [];
        this.verticalPasses = [];
    }

    Field.prototype.init = function() {
        var field = document.querySelector('.field');

        // изначально поле было 1024 х 640. Нацело не делятся на 40 и 24.. Поэтому сделала приближенные к этому размеры и поменяла размер плиточек изначальный 50 х 50 на 26 х 26.
        field.style.width = this.tileSize*this.width + 'px';
        field.style.height = this.tileSize*this.height + 'px';

        // делим поле на секции - квадраты
        for (var i = 1; i <= this.width; i += this.squareSize) {
            for (var j = 1; j <= this.height; j += this.squareSize) {
                this.squares.push({
                    topLeftX: i,
                    topLeftY: j,
                    hasRoom: false,
                    hasHorizontalPass: false,
                    hasVerticalPass: false
                });
            }
        }

        this.arrangePasses();
        // console.log(this.horizontalPasses);
        // console.log(this.verticalPasses);
        this.arrangeRooms();
        console.log(this.rooms);

        // !! СДЕЛАТЬ ИСКЛЮЧЕНИЕ ПО КОМНАТАМ и проходам
        //заливаем все стеной, исключая проходы и комнаты
        for (var i = 0; i < this.height; i++) { // колонки field
            for (var j = 0; j < this.width; j++) { // строки field
                const newTile = document.createElement('div');
                newTile.classList.add('tile');
                // если прохода нет на этой клетке, то доабвляем класс стены
                if (this.horizontalPasses.indexOf(i + 1) < 0 && this.verticalPasses.indexOf(j + 1) < 0) newTile.classList.add('tileW');
                // проверить на комнаты
                newTile.style.left = j * this.tileSize + 'px';
                newTile.style.top = i * this.tileSize + 'px';
                field.appendChild(newTile); 
            }
        }
    }

    Field.prototype.changeTileSize = function() {
        $('.tile').css('width', this.tileSize + 'px');
        $('.tile').css('height', this.tileSize + 'px');
    }

    Field.prototype.arrangePasses = function() {

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
                    var newValue = Math.floor(Math.random() * ((this.height - 1) + 1) + 1);
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

    Field.prototype.arrangeRooms = function() {

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
        // генерируем х и у верхнего левого угла комнаты
        // проверяем, чтобы пересекался хотя бы с одним проходом, иначе генерируем заново
        // отмечаем выбранный квадрат занятым
        for (var i = 1; i <= numOfRooms; i++) {
            var freeSquares = this.squares.filter(item => !item.hasRoom);
            console.log(freeSquares);

            // Math.floor(Math.random() * ((max - min) + 1) + min);
            var chosenSquareIndex = Math.floor(Math.random() * (( (freeSquares.length - 1) - 0) + 1) + 0);
            console.log(chosenSquareIndex);

            do {
                // Math.floor(Math.random() * ((max - min) + 1) + min);
                var minX = freeSquares[chosenSquareIndex].topLeftX,
                    maxX = (minX + this.squareSize - 1) - this.rooms[i - 1].width,
                    minY = freeSquares[chosenSquareIndex].topLeftY,
                    maxY = (minY + this.squareSize - 1) - this.rooms[i - 1].height;
                var x = Math.floor(Math.random() * ((maxX - minX) + 1) + minX),
                    y = Math.floor(Math.random() * ((maxY - minY) + 1 ) + minY);
                
                    var isIntersectWithPass = false;
                    isIntersectWithPass = this.verticalPasses.filter(item => item >= minX && item <= (minX + this.squareSize - 1)).some((item) => (item >= x && item <= x + this.rooms[i - 1].width - 1));
                    if (!isIntersectWithPass) {
                        isIntersectWithPass = isIntersectWithPass = this.horizontalPasses.filter(item => item >= minY && item <= (minY + this.squareSize - 1)).some((item) => (item >= y && item <= y + this.rooms[i - 1].height - 1));
                    }

            } while (!isIntersectWithPass); // проверяем, чтобы пересекалось хотя бы с одним проходом

            this.rooms[i - 1].topLeftX = x;
            this.rooms[i - 1].topLeftY = y;
            freeSquares[chosenSquareIndex].hasRoom = true;
        }


        // for (var i = 0; i < this.rooms.length; i++) {
        //     do {
        //         var isIntersectWithPass = false,
        //             isIntersectWithRooms = false;

        //         var x = Math.floor(Math.random() * (((this.width - this.rooms[i].width + 1) - 1) + 1) + 1),
        //             y = Math.floor(Math.random() * (((this.height - this.rooms[i].height + 1) - 1) + 1 ) + 1);

        //         // проверяем с вертикальными проходами - берем от x до x + width
        //         isIntersectWithPass = this.verticalPasses.some((item) => (item >= x && item <= x + this.rooms[i].width));

        //         // проверяем с горизонтальными проходами
        //         if (!isIntersectWithPass) {
        //             isIntersectWithPass = this.horizontalPasses.some((item) => (item >= y && item <= y + this.rooms[i].height));
        //         }

        //         if (!isIntersectWithPass) continue;

        //         // проверяем с массивом уже расположенных комнат на пересечения
        //         var arrangedRooms = this.rooms.filter((item) => item.topLeftX);

        //         this.rooms[i].topLeftX = x;
        //         this.rooms[i].topLeftY = y;

        //         for (var j = 0; j < arrangedRooms.length; j++) {
        //             // проверяем по бОльшему х, если он лежит внутри диапазона х другой комнаты, то проверяем аналогично с у. Если там тоже лежит => пересечение, нет - нет. Если в первом условии не лежит - пересечения нет.

        //             var greaterTopX, lessTopX;

        //             // выбираем ту комнату, которая расположена на карте "правее"
        //             if (arrangedRooms[j].topLeftX >= this.rooms[i].topLeftX) {
        //                 greaterTopX = arrangedRooms[j];
        //                 lessTopX = this.rooms[i];
        //             } else {
        //                 greaterTopX = this.rooms[i];
        //                 lessTopX = arrangedRooms[j];
        //             }
                    
        //             if (greaterTopX.topLeftX <= lessTopX.topLeftX + lessTopX.width) { // тогда аналогично проверяем Y. Иначе нет пересечений
        //                 var greaterTopY, lessTopY;

        //                 // выбираем ту комнату, которая расположена на карте "ниже"
        //                 if (arrangedRooms[j].topLeftY >= this.rooms[i].topLeftY) {
        //                     greaterTopY = arrangedRooms[j];
        //                     lessTopY = this.rooms[i];
        //                 } else {
        //                     greaterTopY = this.rooms[i];
        //                     lessTopY = arrangedRooms[j];
        //                 }

        //                 if (greaterTopY.topLeftY <= lessTopY.topLeftY + lessTopY.height) {
        //                     isIntersectWithRooms = true;
        //                     break;
        //                 }
        //             } 
        //         }


        //     } while (!isIntersectWithPass || isIntersectWithRooms);
        // }
    }

    function Game() {
        this.field = new Field;
    }

    Game.prototype.init = function() {
        this.field.init();
        this.field.changeTileSize();
    }

    var game = new Game();
    game.init();

});