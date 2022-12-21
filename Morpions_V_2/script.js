window.addEventListener('load', function () {
    //canvas setup
    const canvas = this.document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1280;
    canvas.height = 600;

    // console.log($("#btn")[0]);



    var canvasOffset = $("#canvas1").offset();
    var offsetX = canvasOffset.left;
    var offsetY = canvasOffset.top;
    var factX = canvas.width / canvas.clientWidth;
    var factY = canvas.height / canvas.clientHeight;

    var currentPlayer = Math.floor(Math.random() * 2);
    // console.log(Math.floor(Math.random() * 2));

    var player1Name = "Joueur 1 ";
    var player2Name = "Joueur 2 ";

    const player1Rect = { x: 0, y: 0, width: 340, height: 600 };
    const player2Rect = { x: 940, y: 0, width: 340, height: 600 };


    container = this.document.getElementsByClassName('names')[0];
    container.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
    })

    btn = this.document.getElementById('btn');
    btn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        // const inputElement = document.getElementById('inputText');
        // const inputText = inputElement.value;

        var inputText = (document.getElementById('nickName1')).value;
        if (inputText == "")
            player1Name = "Joueur 1 "
        else player1Name = inputText + " ";

        inputText = (document.getElementById('nickName2')).value;
        if (inputText == "")
            player2Name = "Joueur 2 "
        else player2Name = inputText + " ";


        // player2Name = (document.getElementById('nickName2')).value;
        console.log(player1Name);
        console.log(player2Name);
        container.style = "display: none";
        game.paused = false;
    })



    class Rect {
        constructor(x, y, width, height, active, player = null) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.active = active;
            this.player = player;
        }

        contains = function (x, y) {
            return this.x <= x && x <= this.x + this.width &&
                this.y <= y && y <= this.y + this.height;
        }
    }


    function buildGamePadEx() {
        pad = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                pad.push(new Rect(340 + j * 200, 0 + i * 200, 200, 200, true));
            }

        }
        return pad;

    }


    class InputHandle {
        constructor(game) {
            this.game = game;
            // écoute les clicks
            window.addEventListener('click', e => {
                const mouseX = parseInt((e.clientX - offsetX) * factX);
                const mouseY = parseInt((e.clientY - offsetY) * factY);
                e.preventDefault();
                e.stopPropagation();

                if (!this.game.gameOver) {
                    // parcours toutes les cellules du gamePad
                    for (let i = 0, cell; cell = this.game.gamePad[i]; i++) {
                        // si la cellule est active (non occupé) et que le curseur s'y trouve
                        if (cell.active && cell.contains(mouseX, mouseY)) {
                            // curseur par défaut
                            document.body.style = 'cursor: default;';
                            // rend la cellule innactive 
                            cell.active = false;
                            // on retient quel joueur a placé cette pièce
                            cell.player = currentPlayer;

                            if (!this.game.isWinner()) {
                                // passe la main (joueur suivant)
                                currentPlayer = !currentPlayer;
                            } else {
                                this.game.gameOver = true;
                                if (this.game.winningCode == 0)
                                    console.log("Match nul")
                                else {
                                    this.game.UI.winningSound.play();
                                    if (!currentPlayer) {
                                        console.log("Joueur 1 Gagne en " + this.game.winningCode)
                                        this.game.player1Score++;
                                    } else {
                                        console.log("Joueur 2 Gagne en " + this.game.winningCode)
                                        this.game.player2Score++;
                                    }
                                }
                            }
                        }
                    }
                }

                // $("#mouselog").html("Click: " + mouseX + " / " + mouseY);
            });

            // écoute les déplacements de la souris
            window.addEventListener('mousemove', e => {
                if (!this.game.gameOver && !this.game.paused) {
                    // document.body.style = 'cursor: default;';
                    const mouseX = parseInt((e.clientX - offsetX) * factX);
                    const mouseY = parseInt((e.clientY - offsetY) * factY);

                    // parcours les cellules du tableau gamePad
                    for (let i = 0, cell; cell = this.game.gamePad[i]; i++) {
                        // si la cellule est active (non occupé) et que le curseur s'y trouve
                        if (cell.active && cell.contains(mouseX, mouseY)) {
                            // on fait savoir au joueur qu'il peut cliquer ici 
                            // en modifiant le curseur de la souris 
                            document.body.style = 'cursor: pointer;';
                        }
                    }
                    // $("#mouselog").html("Click: " + mouseX + " / " + mouseY);
                }
            });


            // pour que les coordonnées des clicks correspondent avec les
            // N° de cellules après un redimenssionnement 
            // on écoute l'évènement onResize et on recalcule 
            // les offsets et les facteurs de zoom
            window.addEventListener('resize', e => {
                canvasOffset = $("#canvas1").offset();
                offsetX = canvasOffset.left;
                offsetY = canvasOffset.top;
                factX = canvas.width / canvas.clientWidth;
                factY = canvas.height / canvas.clientHeight;
            });

        }
    }





    class Pion {
        constructor(game, cell, scale = 1) {
            this.game = game;
            this.cell = cell;
            this.x = cell.x;
            this.y = cell.y;
            this.cellWidth = cell.width;
            this.cellHeight = cell.height;
            this.scale = scale;
        }

    }

    class PionX extends Pion {
        constructor(game, cell, scale = 1) {
            super(game, cell, scale);
            this.game = game;
            this.width = 180;
            this.height = 180;
            this.image = document.getElementById('player1')

        }

        draw(context) {
            context.save();
            context.filter = 'contrast(2.4) drop-shadow(6px 6px 3px #000)';
            context.drawImage(this.image, this.x + (this.cellWidth - this.width * this.scale) * 0.5,
                this.y + (this.cellHeight - this.height * this.scale) * 0.5, this.width * this.scale, this.height * this.scale);
            context.restore();
        }

    }

    class PionO extends Pion {
        constructor(game, cell, scale = 1) {
            super(game, cell, scale);
            this.game = game;
            this.width = 180;
            this.height = 180;
            this.image = document.getElementById('player2')

        }
        draw(context) {
            context.save();

            context.filter = 'grayScale(1) drop-shadow(6px 6px 3px #000)';
            context.drawImage(this.image, this.x + (this.cellWidth - this.width * this.scale) * 0.5,
                this.y + (this.cellHeight - this.height * this.scale) * 0.5, this.width * this.scale, this.height * this.scale);
            context.restore();
        }
    }

    class Winner extends Pion {
        constructor(game, cell, scale = 1) {
            super(game, cell, scale);
            this.game = game;
            this.y = 30;
            this.width = 180;
            this.height = 180;
            this.visible = false;
            this.image = document.getElementById('winner')

        }
        draw(context) {
            if (this.visible) {
                context.save();

                context.filter = 'drop-shadow(6px 6px 3px #000)';
                context.drawImage(this.image, this.x + (this.cellWidth - this.width * this.scale) * 0.5,
                    this.y + (this.cellHeight - this.height * this.scale) * 0.5, this.width * this.scale, this.height * this.scale);
                context.restore();
            }
        }
    }

    class Background {
        constructor(game) {
            this.game = game;
        }

        draw(context) {
            context.beginPath();
            context.fillStyle = 'black';
            context.moveTo(340, 0);
            context.lineTo(340, this.game.height);

            context.moveTo(940, 0);
            context.lineTo(940, this.game.height);

            for (let i = 1; i < 3; i++) {
                context.moveTo(340 + i * 200, 0);
                context.lineTo(340 + i * 200, this.game.height);

                context.moveTo(340, 0 + i * 200);
                context.lineTo(940, 0 + i * 200);

            }
            context.stroke();
        }
    }

    class WinningLine {
        constructor(game) {
            this.game = game;
            this.x = canvas.width * 0.5;
            this.y = canvas.height * 0.5;
            this.width = 550;
            this.height = 4;
            this.lineWidth = 20;
            this.visible = false;
            this.gradient = null;
            this.bVal = 150;
            this.drawRect = { x: 0, y: 0, width: this.width, height: this.height, radius: 10 };

        }

        makeGradient(x1, y1, x2, y2) {
            this.gradient = ctx.createLinearGradient(x1, y1, x2, y2);
            this.gradient.addColorStop(0, 'rgb(220, 130, 12)');
            this.gradient.addColorStop(0.5, "white");
            this.gradient.addColorStop(1, 'rgb(220, 130, 12)');
        }

        draw(context) {
            if (this.visible && this.game.winningCode > 0) {
                context.save();
                context.beginPath();

                context.filter = 'opacity(0.75)';
                if (this.game.winningCode == 1) {
                    this.drawRect.x = this.x - this.width * 0.5;
                    this.drawRect.y = this.y - this.y * 0.666;
                    this.drawRect.width = this.width;
                    this.drawRect.height = this.height;
                }
                else if (this.game.winningCode == 2) {
                    this.drawRect.x = this.x - this.width * 0.5;
                    this.drawRect.y = this.y;
                    this.drawRect.width = this.width;
                    this.drawRect.height = this.height;
                }

                else if (this.game.winningCode == 3) {
                    this.drawRect.x = this.x - this.width * 0.5;
                    this.drawRect.y = this.y + this.y * 0.666;
                    this.drawRect.width = this.width;
                    this.drawRect.height = this.height;
                }

                if (this.game.winningCode == 4) {
                    this.drawRect.x = this.x - this.x * 0.31;
                    this.drawRect.y = this.y - this.width * 0.5;
                    this.drawRect.width = this.height;
                    this.drawRect.height = this.width;
                }

                else if (this.game.winningCode == 5) {
                    this.drawRect.x = this.x;
                    this.drawRect.y = this.y - this.width * 0.5;
                    this.drawRect.width = this.height;
                    this.drawRect.height = this.width;
                }

                else if (this.game.winningCode == 6) {
                    this.drawRect.x = this.x + this.x * 0.31;
                    this.drawRect.y = this.y - this.width * 0.5;
                    this.drawRect.width = this.height;
                    this.drawRect.height = this.width;
                }

                if (this.game.winningCode > 0 && this.game.winningCode < 7) {

                    if (this.game.winningCode > 0 && this.game.winningCode < 4)
                        this.makeGradient(this.drawRect.x, this.drawRect.y, this.drawRect.x + this.drawRect.width, this.drawRect.y);
                    else
                        this.makeGradient(this.drawRect.x, this.drawRect.y, this.drawRect.x, this.drawRect.y + this.drawRect.height);

                    context.fillStyle = 'green';
                    context.lineWidth = 20;
                    context.strokeStyle = this.gradient;
                    context.roundRect(this.drawRect.x, this.drawRect.y, this.drawRect.width, this.drawRect.height, this.drawRect.radius);
                }
                else
                    if (this.game.winningCode == 7) {
                        context.lineCap = "round";
                        context.lineWidth = 20;
                        this.makeGradient(this.x - this.x * 0.4, this.y - this.width * 0.5, this.x + this.x * 0.4, this.y + this.width * 0.5);
                        context.strokeStyle = this.gradient;
                        context.moveTo(this.x - this.x * 0.4, this.y - this.width * 0.5);
                        context.lineTo(this.x + this.x * 0.4, this.y + this.width * 0.5);
                        context.stroke();
                        context.lineWidth = 4;
                        context.strokeStyle = 'green';
                        context.moveTo(this.x - this.x * 0.4, this.y - this.width * 0.5);
                        context.lineTo(this.x + this.x * 0.4, this.y + this.width * 0.5);
                    } else if (this.game.winningCode == 8) {
                        context.lineCap = "round";
                        context.lineWidth = 20;
                        this.makeGradient(this.x + this.x * 0.4, this.y - this.width * 0.5, this.x - this.x * 0.4, this.y + this.width * 0.5);
                        context.strokeStyle = this.gradient;
                        context.moveTo(this.x + this.x * 0.4, this.y - this.width * 0.5);
                        context.lineTo(this.x - this.x * 0.4, this.y + this.width * 0.5);
                        context.stroke();
                        context.lineWidth = 4;
                        context.strokeStyle = 'green';
                        context.moveTo(this.x + this.x * 0.4, this.y - this.width * 0.5);
                        context.lineTo(this.x - this.x * 0.4, this.y + this.width * 0.5);
                    }
                context.stroke();
                context.fill();
                context.restore();
            }
        }
    }

    class Button {
        constructor(game, title) {
            this.game = game;
            this.x = canvas.width * 0.5;
            this.y = (canvas.height + canvas.height * 0.333) * 0.5;
            this.posX = canvas.width;
            this.posY = canvas.height;
            this.width = 200;
            this.height = 100;
            this.title = title;
            this.color = 'white';
            this.fontSize = 34;
            this.visible = false;
            this.btnRect = new Rect(this.x - this.width * 0.5, this.y - this.height * 0.5, this.width, this.height, false);

            window.addEventListener('click', e => {
                const mouseX = parseInt((e.clientX - offsetX) * factX);
                const mouseY = parseInt((e.clientY - offsetY) * factY);
                e.preventDefault();
                e.stopPropagation();

                if (this.visible && this.game.gameOver && this.btnRect.contains(mouseX, mouseY)) {
                    setTimeout(() => {
                        this.game.reset();
                        this.visible = false;
                        // reset position
                        this.posX = canvas.width;
                        this.posY = canvas.height;

                    }, 250);

                }
            });

            window.addEventListener('mousemove', e => {
                const mouseX = parseInt((e.clientX - offsetX) * factX);
                const mouseY = parseInt((e.clientY - offsetY) * factY);
                if (this.game.gameOver && this.visible && this.btnRect.contains(mouseX, mouseY)) {
                    document.body.style = 'cursor: pointer;';
                }
                else if (this.visible)
                    document.body.style = 'cursor: default;';

            })
        }

        draw(context) {
            if (this.visible && this.game.gameOver) {
                if (this.posY > this.y) this.posY -= 5;
                context.save();
                context.beginPath();
                context.fillStyle = 'green';
                context.lineWidth = 20;
                context.strokeStyle = 'rgb(65, 181, 109)';
                context.roundRect(this.x - this.width * 0.5, this.posY - this.height * 0.5, this.width, this.height, 25);
                context.stroke();
                context.fill();
                context.restore();
                context.save();
                context.fillStyle = this.color;
                context.shadowOffsetX = 4;
                context.shadowOffsetY = 4;
                context.shadowBlur = 4;
                context.shadowColor = 'black';
                context.textAlign = 'center';
                context.font = this.fontSize + 'px ' + this.fontFamily;
                // score
                context.fillText(this.title, this.x, this.posY + this.fontSize * 0.25);
                context.restore();
            }
        }
    }

    class ConfigBtn {
        constructor(game, title) {
            this.game = game;
            this.x = 50;
            this.y = 50;
            this.posX = 80;
            this.posY = 80;
            this.width = 40;
            this.height = 40;
            this.title = title;
            this.color = 'white';
            this.fontSize = 50;
            this.visible = true;
            this.btnRect = new Rect(this.x - this.width * 0.5, this.y - this.height * 0.5, this.width, this.height, false);


            window.addEventListener('click', e => {
                const mouseX = parseInt((e.clientX - offsetX) * factX);
                const mouseY = parseInt((e.clientY - offsetY) * factY);
                e.preventDefault();
                e.stopPropagation();

                if (this.btnRect.contains(mouseX, mouseY)) {
                    setTimeout(() => {
                        container.style = 'display: block;'
                        this.game.paused = true;

                    }, 250);

                }
            });

            window.addEventListener('mousemove', e => {
                const mouseX = parseInt((e.clientX - offsetX) * factX);
                const mouseY = parseInt((e.clientY - offsetY) * factY);
                if (this.btnRect.contains(mouseX, mouseY)) {
                    document.body.style = 'cursor: pointer;';
                }
                else if (!this.game.UI.replayBtn.visible)
                    document.body.style = 'cursor: default;';

            })
        }

        draw(context) {
            if (this.visible) {
                context.save();
                context.beginPath();
                context.fillStyle = 'green';
                context.lineWidth = 12;
                context.strokeStyle = 'rgb(65, 181, 109)';
                context.roundRect(this.x - this.width * 0.5, this.y - this.height * 0.5, this.width, this.height, 25);
                context.stroke();
                context.fill();
                context.restore();
                context.save();
                context.fillStyle = this.color;
                context.shadowOffsetX = 4;
                context.shadowOffsetY = 4;
                context.shadowBlur = 4;
                context.shadowColor = 'black';
                context.textAlign = 'center';
                context.font = this.fontSize + 'px ' + this.fontFamily;
                // score
                context.fillText(this.title, this.x, this.y + this.fontSize * 0.5);
                context.restore();
            }
        }
    }

    class UI {
        constructor(game) {
            this.game = game;
            this.fontSize = 38;
            this.fontFamily = 'Bangers';
            this.color = 'white';
            this.pionPlayer1 = new PionX(this.game, player1Rect, 0.5);
            this.pionPlayer2 = new PionO(this.game, player2Rect, 0.5);
            this.winner = new Winner(this.game, player1Rect, 2);
            this.replayBtn = new Button(this.game, 'rejouer');
            this.winningSound = new Audio('snd/winner.mp3');
            this.winningLine = new WinningLine(this.game);
            this.configBtn = new ConfigBtn(this.game, '*')
            this.currentPlayerRect = (!currentPlayer) ? player1Rect : player2Rect;
            this.bVal = 0;
            this.timer = 0;
            this.timerLimit = 1000;
            this.direction = true;
            this.gradient = null;
            this.msg = "";
            this.deltaTime = 0;
        }

        update() {

            if (this.direction) {
                if (this.bVal < 254) {
                    this.bVal += 2;
                } else this.direction = !this.direction;
            }
            else {
                if (this.bVal > 1) {
                    this.bVal -= 2;
                } else this.direction = !this.direction;
            }
            //************************************************************************************************************** */
            if (this.game.gameOver) {
                if (this.game.winningCode == 0) {
                    this.replayBtn.visible = true;
                    this.msg = "Match nul rejouer !";
                }
                else {

                    this.winningLine.visible = true;
                    if (!this.replayBtn.visible) {
                        setTimeout(() => {
                            this.replayBtn.visible = true;
                            this.winner.visible = true;
                            if (!currentPlayer)
                                this.msg = `${player1Name}Gagne`
                            else this.msg = `${player2Name}Gagne`
                        }, 2000)
                    }
                }
            }
            else this.msg = ""

        }

        draw(context) {
            // determine quel coté on dessine en fonction du joueur qui a la main.
            this.currentPlayerRect = (!currentPlayer) ? player1Rect : player2Rect;
            context.save();

            // crée un dégradé pour mieu visualiser quel joueur a la main.
            context.filter = 'opacity(0.75)';
            this.gradient = context.createLinearGradient(this.currentPlayerRect.x, this.currentPlayerRect.y, this.currentPlayerRect.x + this.currentPlayerRect.width, this.currentPlayerRect.y + this.currentPlayerRect.height);
            this.gradient.addColorStop(0, 'green');
            this.gradient.addColorStop(.5, `rgb(${this.bVal} , 255, ${this.bVal})`);
            this.gradient.addColorStop(.5, 'rgb(' + this.bVal + ', 255, ' + this.bVal + ')');
            this.gradient.addColorStop(1, 'green');
            context.fillStyle = this.gradient;

            if (!currentPlayer) {
                this.pionPlayer1.scale = 0.75;
                this.pionPlayer2.scale = 0.5;
            } else {
                this.pionPlayer1.scale = 0.5;
                this.pionPlayer2.scale = 0.75;
            }
            // on applique le dégradé
            context.fillRect(this.currentPlayerRect.x, this.currentPlayerRect.y, this.currentPlayerRect.width, this.currentPlayerRect.height);
            context.restore();

            this.winningLine.draw(context);
            context.save();

            context.fillStyle = this.color;
            context.shadowOffsetX = 4;
            context.shadowOffsetY = 4;
            context.shadowBlur = 4;
            context.shadowColor = 'black';
            context.textAlign = 'center';
            context.font = this.fontSize + 'px ' + this.fontFamily;
            // score
            context.fillText(`Score de ${player1Name} : ` + this.game.player1Score, player1Rect.x + player1Rect.width * 0.5, 140);
            context.fillText(`Score de ${player2Name} : ` + this.game.player2Score, player2Rect.x + player2Rect.width * 0.5, 140);

            // dessine les Pions respectif
            this.pionPlayer1.draw(context);
            this.pionPlayer2.draw(context);


            // crée un dégradé pour mieu visualiser quel joueur a la main.
            context.filter = 'opacity(0.75)';
            this.gradient = context.createLinearGradient(this.currentPlayerRect.x, this.currentPlayerRect.y, this.currentPlayerRect.x + this.currentPlayerRect.width, this.currentPlayerRect.y + this.currentPlayerRect.height);
            this.gradient.addColorStop(0, `rgb(${this.bVal}, ${this.bVal}, 255)`);
            this.gradient.addColorStop(1, `rgb(${this.bVal}, ${this.bVal}, 255)`);
            context.fillStyle = this.gradient;
            context.font = '120px ' + this.fontFamily;

            context.fillText(this.msg, canvas.width * 0.5, canvas.height * 0.5);
            context.restore();
            this.configBtn.draw(context);
            this.replayBtn.draw(context);
            this.winner.x = this.currentPlayerRect.x;
            this.winner.draw(context);

        }
    }

    class Game {
        constructor(width, height) {
            this.background = new Background(this);
            this.UI = new UI(this);
            this.gamePad = buildGamePadEx();
            this.input = new InputHandle(this);
            // this.morpions = [];
            this.pions = [];
            this.width = width;
            this.height = height;
            this.score = 0;
            this.gameOver = false;
            this.win_h_top = [this.gamePad[0], this.gamePad[1], this.gamePad[2]];
            this.win_h = [this.gamePad[3], this.gamePad[4], this.gamePad[5]];
            this.win_h_bottom = [this.gamePad[6], this.gamePad[7], this.gamePad[8]];
            this.win_v_left = [this.gamePad[0], this.gamePad[3], this.gamePad[6]];
            this.win_v = [this.gamePad[1], this.gamePad[4], this.gamePad[7]];
            this.win_v_right = [this.gamePad[2], this.gamePad[5], this.gamePad[8]];
            this.win_d_1 = [this.gamePad[0], this.gamePad[4], this.gamePad[8]];
            this.win_d_2 = [this.gamePad[6], this.gamePad[4], this.gamePad[2]];
            this.winningCode = -1;
            this.paused = false;
            this.player1Score = 0;
            this.player2Score = 0;

        }

        reset() {
            this.UI.replayBtn.visible = false;
            this.UI.winner.visible = false;
            // this.pions = [];
            this.gamePad.forEach(cell => {
                cell.active = true;
                cell.player = null;
            });
            this.gameOver = false;
            this.winningCode = -1;
        }

        isWinner() {
            function isWinningLine(cells) {
                return (!(cells[0].active || cells[1].active || cells[2].active)) &&
                    (cells[0].player == cells[1].player && cells[1].player == cells[2].player)
            }

            function isNull(cells) {
                return !((cells[0].active || cells[1].active || cells[2].active) ||
                    (cells[3].active || cells[4].active || cells[5].active) ||
                    (cells[6].active || cells[7].active || cells[8].active));
            }

            let ret = false;
            switch (true) {
                case isWinningLine(this.win_h_top):
                    this.winningCode = 1;
                    ret = true
                    break;
                case isWinningLine(this.win_h):
                    this.winningCode = 2;
                    ret = true
                    break;
                case isWinningLine(this.win_h_bottom):
                    this.winningCode = 3;
                    ret = true
                    break;

                case isWinningLine(this.win_v_left):
                    this.winningCode = 4;
                    ret = true
                    break;
                case isWinningLine(this.win_v):
                    this.winningCode = 5;
                    ret = true
                    break;
                case isWinningLine(this.win_v_right):
                    this.winningCode = 6;
                    ret = true
                    break;

                case isWinningLine(this.win_d_1):
                    this.winningCode = 7;
                    ret = true
                    break;
                case isWinningLine(this.win_d_2):
                    this.winningCode = 8;
                    ret = true
                    break;

                case isNull(this.gamePad):
                    this.winningCode = 0;
                    ret = true
                    break;

                default:
                    this.winningCode = -1;
                    ret = false;
                    break;
            }
            return ret;

        }

        update(deltaTime) {

            if (this.gameOver)
                this.gamePad.forEach(cell => {
                    cell.active = false;
                });

            this.UI.update(deltaTime);
            this.pions = [];

            this.gamePad.forEach(cell => {
                if (cell.player != null) {
                    if (!cell.player) {
                        this.pions.push(new PionX(this, cell));
                    } else
                        this.pions.push(new PionO(this, cell));
                }
            });

        }

        draw(context) {
            this.background.draw(context);

            this.pions.forEach(pion => {
                pion.draw(context);
            })
            this.UI.draw(context);
        }
    }

    var game = new Game(canvas.width, canvas.height);



    let lastTime = 0;
    // Boucle d'annimation
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        // console.log(deltaTime);
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!game.paused)
            game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }

    animate(0);



})


    // function showInputText() {
    //     const inputElement = document.getElementById('inputText');
    //     const inputText = inputElement.value;
    //     alert(inputText);
    //     inputElement.style="display: none;";
    //   }