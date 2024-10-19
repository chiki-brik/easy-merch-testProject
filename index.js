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

        // генерируем и отображаем горизонтальные проходы
        var numOfHorizontalPasses = Math.round(Math.random() * (5 - 3) + 3);
        for (var i = 0; i < numOfHorizontalPasses; i++) {
            do { // чтобы не повторялись и не стояли рядом
                var newValue = Math.round(Math.random() * (this.height - 1) + 1);
            } while (this.horizontalPasses.indexOf(newValue) >= 0 || this.horizontalPasses.indexOf(newValue + 1) >= 0 || this.horizontalPasses.indexOf(newValue - 1) >= 0);
            
            this.horizontalPasses.push(newValue);
        }
        console.log(this.horizontalPasses);

        // генерируем и отображаем вертикальные проходы
        var numOfVerticalPasses = Math.round(Math.random() * (5 - 3) + 3);
        for (var i = 0; i < numOfVerticalPasses; i++) {
            do {
                var newValue = Math.round(Math.random() * (this.width - 1) + 1);
            } while (this.verticalPasses.indexOf(newValue) >= 0 || this.verticalPasses.indexOf(newValue + 1) >= 0 || this.verticalPasses.indexOf(newValue - 1) >= 0);

            this.verticalPasses.push(newValue);
        }
        console.log(this.verticalPasses);

        // определеяем кол-во и размер комнат
        var numOfRooms = Math.round(Math.random() * (4 - 2) + 2); // (10 - 5) + 5
        for (var i = 0; i < numOfRooms; i++) {
            this.rooms.push({
                width: Math.round(Math.random() * (8 - 3) + 3),
                height: Math.round(Math.random() * (8 - 3) + 3)
            });
        }

        console.log(this.rooms);
        // располагаем комнат
        this.arrangeRooms();
        console.log(this.rooms);

        // !! СДЕЛАТЬ ИСКЛЮЧЕНИЕ ПО КОМНАТАМ
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

        //this.changeTileSize();
    }

    Field.prototype.changeTileSize = function() {
        $('.tile').css('width', this.tileSize + 'px');
        $('.tile').css('height', this.tileSize + 'px');
    }

    Field.prototype.arrangeRooms = function() {

        // нужно пройтись по каждой комнате 
        // генерируем верхний левый угол комнаты
        // проверяем, чтобы БЫЛО пересечение хотя бы с одним проходом
        // проверяем, чтобы НЕ БЫЛО именно пересечений с уже расположенными комнатами(предполагаем, что соприкасаться могут)
        // иначе перегенерируем

        for (var i = 0; i < this.rooms.length; i++) {
            do {
                var isIntersectWithPass = false,
                    isIntersectWithRooms = false;

                var x = Math.round(Math.random() * ((this.width - this.rooms[i].width + 1) - 1) + 1),
                    y = Math.round(Math.random() * ((this.height - this.rooms[i].height + 1) - 1) + 1);

                // проверяем с вертикальными проходами - берем от x до x + width
                isIntersectWithPass = this.verticalPasses.some((item) => (item >= x && item <= x + this.rooms[i].width));

                // проверяем с горизонтальными проходами
                if (!isIntersectWithPass) {
                    isIntersectWithPass = this.horizontalPasses.some((item) => (item >= y && item <= y + this.rooms[i].height));
                }

                if (!isIntersectWithPass) continue;

                // проверяем с массивом уже расположенных комнат на пересечения
                var arrangedRooms = this.rooms.filter((item) => item.topLeftX);

                this.rooms[i].topLeftX = x;
                this.rooms[i].topLeftY = y;

                for (var j = 0; j < arrangedRooms.length; j++) {
                    // проверяем по бОльшему х, если он лежит внутри диапазона х другой комнаты, то проверяем аналогично с у. Если там тоже лежит => пересечение, нет - нет. Если в первом условии не лежит - пересечения нет.

                    var greaterTopX, lessTopX;

                    // выбираем ту комнату, которая расположена на карте "правее"
                    if (arrangedRooms[j].topLeftX >= this.rooms[i].topLeftX) {
                        greaterTopX = arrangedRooms[j];
                        lessTopX = this.rooms[i];
                    } else {
                        greaterTopX = this.rooms[i];
                        lessTopX = arrangedRooms[j];
                    }
                    
                    if (greaterTopX.topLeftX <= lessTopX.topLeftX + lessTopX.width) { // тогда аналогично проверяем Y. Иначе нет пересечений
                        var greaterTopY, lessTopY;

                        // выбираем ту комнату, которая расположена на карте "ниже"
                        if (arrangedRooms[j].topLeftY >= this.rooms[i].topLeftY) {
                            greaterTopY = arrangedRooms[j];
                            lessTopY = this.rooms[i];
                        } else {
                            greaterTopY = this.rooms[i];
                            lessTopY = arrangedRooms[j];
                        }

                        if (greaterTopY.topLeftY <= lessTopY.topLeftY + lessTopY.height) {
                            isIntersectWithRooms = true;
                            break;
                        }
                    } 
                }


            } while (!isIntersectWithPass || isIntersectWithRooms);
        }
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