// player représente le joueur en cours
// player = false => Player 1 X
// player = true => player 2 O
let player = false;
let cells = [];
let playBtn = this.document.getElementById('startBtn');
let msgDiv = this.document.querySelector(".message");
let imgs = this.document.querySelectorAll('.img-X, .img-O');
let player1Div = this.document.querySelector(".player-1");
let player2Div = this.document.querySelector(".player-2");
let winningSound = new Audio("snd/winner.mp3");
let winDivBars = this.document.querySelectorAll('[class*="win-"]');

// let score = 0; 


window.addEventListener('load', function () {
    // assigne un la fonction initGame() à l'évènement onclick du bouton
    playBtn.setAttribute("onclick", 'initGame();');
    // quand la page est chargé on initilise le jeu;
    initGame();

});

// initialise le jeu
function initGame() {

    // vide le tableau 
    cells = ["", "", "",
             "", "", "",
             "", "", ""];

    // rend toutes les cases cliquables
    for (let i = 1; i < 10; i++) {
        divCell = this.document.getElementById(i.toString());
        divCell.setAttribute("onclick", 'cellClick(this);');
        divCell.classList.add("playable");

    }
    // désactive le bouton "rejouer"
    playBtn.classList.add("disabled");

    // cache les barres qui indiquent les 3 coup gagnant
    for (var i = 0, winDivBar; winDivBar = winDivBars[i]; i++) {
        winDivBar.classList.remove("visible");
        winDivBar.style.visibility = "collapse";
    }

    // efface les coups de la partie précédente
    for (var i = 0, img; img = imgs[i]; i++) {
        img.classList.add("d-none");
    }

    // cache tous les élément de classe .collapse
    $(".collapse").collapse('hide');
    inviteToPlay();
}

// arrête la partie 
function stopGame() {
    // en supprimant toute possibilité de click sur les cases
    for (let i = 1; i < 10; i++) {
        divCell = this.document.getElementById(i.toString());
        divCell.setAttribute("onclick", '');
        divCell.classList.remove("playable");
    }
    // on rend le bouton "rejouer" cliquable
    setTimeout(() => {
        playBtn.classList.remove("disabled");
        playBtn.focus();
    }, 4000);

}

// joue le son "Partie Gagnée"
function playWinningSound() {
    winningSound.load();
    winningSound.play();
}

// fonction qui gère les click
// elem : représente l'élément sur lequel je joueur à cliqué
function cellClick(elem) {
    let playerNb = (!player) ? "1" : "2";
    let msg = "Joueur " + playerNb;

    // pour chaque enfants de "elem"
    for (const child of elem.children) {
        // si joueur 2
        if (player && child.classList.contains('img-O')) {
            child.classList.remove("d-none");
            cells[elem.id - 1] = "O";
            // sinon joueur 1
        } else if (!player && child.classList.contains('img-X')) {
            child.classList.remove("d-none");
            cells[elem.id - 1] = "X";
        }
    }

    // change le satatus de l'élément sur lequel le joueur à cliqué
    elem.setAttribute("onclick", '');
    elem.classList.remove("playable");

    // teste si il y a un gagnant
    if (isWinning()) {
        // score++;
        msgDiv.innerText = "Le " + msg + " à Gagné ";
        stopGame();
        playWinningSound();

        setTimeout(() => {
            $("#winner-msg").collapse('show');
            $("#winner-" + playerNb).collapse('show')
        }, 2000);
        return;
        // teste si match nul
    } else if (cells.join('').length == 9) {
        msgDiv.innerText = "Match nul rejouer !";
        $(".collapse").collapse('show');
        stopGame();
        return;
    }
    player = !player;
    inviteToPlay();
}



function isWinning() {

    function getSubArray(id1, id2, id3) {

        return cells[id1] + cells[id2] + cells[id3];
    }


    function isWinLine(chars) {
        return (chars[0] == chars[1] && chars[1] == chars[2])
    }

    let win_h_top = getSubArray(0, 1, 2);
    let win_h = getSubArray(3, 4, 5);
    let win_h_bottom = getSubArray(6, 7, 8);

    let win_v_top = getSubArray(0, 3, 6);
    let win_v = getSubArray(1, 4, 7); 
    let win_v_bottom = getSubArray(2, 5, 8);

    let win_d_1 = getSubArray(0, 4, 8);
    let win_d_2 = getSubArray(6, 4, 2);

    // controle les combinaison possibles
    switch (true) {
        // horisontale
        case win_h_top.length == 3 && isWinLine(win_h_top):
            setTimeout(() => {
                winDivBars[0].classList.add('visible');
            }, 2000);
            return true;
            break;

        case win_h.length == 3 && isWinLine(win_h):
            setTimeout(() => {
                winDivBars[1].classList.add('visible');
            }, 2000);
            return true;
            break;

        case win_h_bottom.length == 3 && isWinLine(win_h_bottom):
            setTimeout(() => {
                winDivBars[2].classList.add('visible');
            }, 2000);
            return true;
            break;

        // verticale
        case win_v_top.length == 3 && isWinLine(win_v_top):
            setTimeout(() => {
                winDivBars[3].classList.add('visible');
            }, 2000);
            return true;
            break;

        case win_v.length == 3 && isWinLine(win_v):
            setTimeout(() => {
                winDivBars[4].classList.add('visible');
            }, 2000);
            return true;
            break;

        case win_v_bottom.length == 3 && isWinLine(win_v_bottom):
            setTimeout(() => {
                winDivBars[5].classList.add('visible');
            }, 2000);
            return true;
            break;

        // diagonale
        case win_d_1.length == 3 && isWinLine(win_d_1):
            setTimeout(() => {
                winDivBars[7].classList.add('visible');
            }, 2000);
            return true;
            break;

        case win_d_2.length == 3 && isWinLine(win_d_2):
            setTimeout(() => {
                winDivBars[6].classList.add('visible');
            }, 2000);
            return true;
            break;

        default:
            return false;
            break;
    }
}

function togglePlayer() {
    player = !player;
}

function inviteToPlay() {
    if (!player) {
        setTimeout(() => {
            player1Div.classList.add("playing");
            player2Div.classList.remove("playing");
        }, 500);
    } else {
        setTimeout(() => {
            player1Div.classList.remove("playing");
            player2Div.classList.add("playing");
        }, 500);
    }
}
