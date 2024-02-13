
HEIGHT = 800;
WIDTH = 800;


let fonctionEnCours = waitClickGame;

//FPS:
let fpsInterval = 1000 / 60;

//tuyaux:
let listeTuyaux = [];
let vitesseTuyauxX = -2;
let espacementEntreTuyaux = HEIGHT / 4;
let tailleImageY = HEIGHT;
let tailleImageX = 100;

//jeu:
let possitionGroundY = HEIGHT - HEIGHT / 5;
let nombreImageGround = 20;
let possitionPremierGroundX = 0;
let ImageGroundTailleX = WIDTH / nombreImageGround;
let tempEntreTuyaux = 3000; // 1000 = 1s
let score = 0;
let perdu = false;
let restartGame = false;
let enGame = false;
let gravity = 0.3;


//button:
let listeButton = []

//bird:
let vitesseEnSaut = -6;
let tailleBird = HEIGHT / 15;
bird = {
    x: 50,
    y: possitionGroundY / 2,
    width: tailleBird,
    height: tailleBird,
    vitesseY: 2,
    jump: false,
    spreetSheetX: 0
}

//avant game:
let targetPosMinY = bird.y + (bird.height / 2) - bird.height * 1.5;
let targetPosMaxY = bird.y + (bird.height / 2) + bird.height * 1.5;


class Button {
    constructor(x, y, width, height, imageBackGround) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.imageBackGround = imageBackGround;
    }

    draw(context) {
        context.drawImage(this.imageBackGround, this.x, this.y, this.width, this.height);
    }
}


window.onload = function () {
    board = document.getElementById("board")
    board.height = HEIGHT;
    board.width = WIDTH;
    context = board.getContext("2d");

    // image bird:
    imageBird = new Image();
    imageBird.src = "img/red_bird.png";

    // image tuyaux haut:
    imageTuyauxHaut = new Image();
    imageTuyauxHaut.src = "img/tuyaux_red_haut.png";
    imageTuyauxBas = new Image();
    imageTuyauxBas.src = "img/tuyaux_red_bas.png";

    // image wallPaper:
    imageWallPaper = new Image()
    imageWallPaper.src = "img/wallPapper.png";

    // image ground:
    imageGround = new Image();
    imageGround.src = "img/ground.png";

    //image button:
    imageButtonRestart = new Image();
    imageButtonRestart.src = "img/restart.png";
    
    setInterval(() => fonctionEnCours(), fpsInterval);
    //requestAnimationFrame(waitClickGame);
    setInterval(AnnimationBird, 150) // 150ms = 0.15s (1s = 1000ms)
    setInterval(createTuyaux, tempEntreTuyaux)
    document.addEventListener("keydown", pressKey);
    document.addEventListener("click", pressClick)

}


function initGame() {
    perdu = false;
    score = 0;
    bird = {
        x: 50,
        y: possitionGroundY / 2,
        width: tailleBird,
        height: tailleBird,
        vitesseY: 2,
        jump: false,
        spreetSheetX: 0
    }
    listeButton = [];
    listeTuyaux = [];

    fonctionEnCours = waitClickGame;
}

function waitClickGame() {
   if (enGame) {
        bird.jump = true;
        bird.vitesseY = vitesseEnSaut;
        fonctionEnCours = game;
    }

    bird.y += bird.vitesseY;

    if (bird.vitesseY > 0 && targetPosMaxY < (bird.y + (bird.height / 2))) {
        bird.vitesseY *= -1;
    } else if (bird.vitesseY < 0 && targetPosMinY > (bird.y + (bird.height / 2))) {
        bird.vitesseY *= -1;
    }

    //affiche wallPapper:
    context.drawImage(imageWallPaper, 0, 0, WIDTH, possitionGroundY);

    //affiche bird:
    context.drawImage(imageBird, 16.9 * bird.spreetSheetX, 0, 16.9, 12, bird.x, bird.y, bird.width, bird.height);

    //groud:
    for (let i = 0; i < nombreImageGround + 1; i++) {
        context.drawImage(imageGround, (ImageGroundTailleX * i) - possitionPremierGroundX, possitionGroundY, ImageGroundTailleX, HEIGHT - possitionGroundY);
    }

    //move ground:
    possitionPremierGroundX -= vitesseTuyauxX;
    if (possitionPremierGroundX >= ImageGroundTailleX) {
        possitionPremierGroundX = 0
    }

}



function game() {
     if (!perdu) {
        fonctionEnCours = game;
     }
     else {
        fonctionEnCours = initPageFinGame;
    }    
    context.drawImage(imageWallPaper, 0, 0, WIDTH, possitionGroundY);

    //affiche score:
    context.font = "48px verdana";
    context.textAlign = "center";
    context.fillText(score, WIDTH / 2, 50);

    //TUYAUX:
    //affiche
    listeTuyaux.forEach(function (item) {
        context.drawImage(item.imageTuyaux, item.x, item.y, item.width, item.height);
    })
    //mouvement 
    listeTuyaux.forEach(function (item) {
        item.x += vitesseTuyauxX;
    })

    // Bird:
    bird.vitesseY += gravity;
    bird.y += bird.vitesseY;

    if (bird.jump) {
        bird.jump = false;
    }
    context.drawImage(imageBird, 16.9 * bird.spreetSheetX, 0, 16.9, 12, bird.x, bird.y, bird.width, bird.height);

    //groud:
    for (let i = 0; i < nombreImageGround + 1; i++) {
        context.drawImage(imageGround, (ImageGroundTailleX * i) - possitionPremierGroundX, possitionGroundY, ImageGroundTailleX, HEIGHT - possitionGroundY);
    }
    //move ground:
    possitionPremierGroundX -= vitesseTuyauxX;
    if (possitionPremierGroundX >= ImageGroundTailleX) {
        possitionPremierGroundX = 0
    }

    //affiche score:
    context.font = "48px verdana";
    context.textAlign = "center";
    context.fillText(score, WIDTH / 2, 50);

    AugmenteScore();
    supprimeTuyaux();
    TestDefaite();

}



function createTuyaux() {
    if (enGame) {

        let possitionTuyauxY = (Math.floor(Math.random() * (HEIGHT / 2))) - tailleImageY;

        tuyauxHaut = {
            x: WIDTH,
            y: possitionTuyauxY,
            width: tailleImageX,
            height: tailleImageY,
            imageTuyaux: imageTuyauxHaut,
            passeBird: false
        }

        tuyauxBas = {
            x: WIDTH,
            y: tuyauxHaut.y + tailleImageY + espacementEntreTuyaux,
            width: tailleImageX,
            height: tailleImageY,
            imageTuyaux: imageTuyauxBas,
            passeBird: true
        }

        listeTuyaux.push(tuyauxHaut);
        listeTuyaux.push(tuyauxBas);
    }
}

function AnnimationBird() {
    if (bird.spreetSheetX >= 2) {
        bird.spreetSheetX = 0;
    } else {
        bird.spreetSheetX++;
    }
}

function pressKey(event) {
    if (event.code == "Space" && !bird.jump && enGame) {
        bird.vitesseY = vitesseEnSaut;
        bird.jump = true;

    } else if (event.code == "Space" && !enGame) {
        enGame = true;
    }
}

function pressClick(event) {

    mouseX = event.pageX - (board.clientLeft + board.offsetLeft);
    mouseY = event.pageY - (board.clientTop + board.offsetTop);

    if (!enGame) {
        if (listeButton.length != 0) {
            //test si il clique dans un bouton:
            listeButton.forEach(function (item) {
                if (siClickSurBouton(item, mouseX, mouseY)) {
                    restartGame = true;
                }
            })
        } else {
            enGame = true;
        }

    } else {
        if (0 <= mouseX && mouseX <= WIDTH && 0 <= mouseY && mouseY <= HEIGHT) {
            bird.vitesseY = vitesseEnSaut;
            bird.jump = true;

        }
    }
}

function siClickSurBouton(rect1, mouseX, mouseY) {
    return (rect1.x <= mouseX && mouseX <= rect1.x + rect1.width ||
        mouseX <= rect1.x && rect1.x <= mouseX + 1) &&
        (rect1.y <= mouseY && mouseY <= rect1.y + rect1.height ||
            mouseY <= rect1.y && rect1.y <= mouseY + 1);
}

function TestDefaite() {
    if (possitionGroundY <= bird.y + bird.height) {
        perdu = true;
    }
    listeTuyaux.forEach(function (item) {
        if (
            //collision
            (bird.x < item.x + item.width &&
                bird.x + bird.width > item.x &&
                bird.y < item.y + item.height &&
                bird.height + bird.y > item.y) ||

            //test si l'uti passe pas au dessus des tuyaux:
            ((item.x <= bird.x && bird.x <= item.x + item.width ||
                item.x <= bird.x + bird.width && bird.x + bird.width <= item.x + item.width) &&
                bird.y + bird.height <= 0)
        ) {
            perdu = true;
        }
    });
}

function AugmenteScore() {
    listeTuyaux.forEach(function (item) {
        if (item.x + item.width / 2 <= bird.x + bird.width / 2 && !item.passeBird) {
            score++;
            item.passeBird = true;
        }
    });
}

function supprimeTuyaux() {
    listeTuyaux.forEach(function (item, index) {
        if (item.x + item.width <= 0) {
            // je supprime le tuyaux
            listeTuyaux.splice(index, 1);
        }
    })
}


function initPageFinGame() {

    enGame = false;
    let largeurButton = WIDTH / 4;
    let hauteurButton = HEIGHT / 10;
    button1 = new Button((WIDTH / 2) - (largeurButton / 2), (HEIGHT / 2) + 100, largeurButton, hauteurButton, imageButtonRestart);
    listeButton.push(button1)
    fonctionEnCours = pageFinGame;

}

function pageFinGame() {
    if (restartGame) {
        restartGame = false;
        fonctionEnCours = initGame;
    }

    //affiche score:
    context.font = "48px verdana";
    context.textAlign = "center";
    context.fillText("Tu as perdu !!!", WIDTH / 2, HEIGHT / 2 - 50);
    context.fillText("Tu as fait un score de " + score, WIDTH / 2, HEIGHT / 2 + 50);

    //affiche button:
    listeButton.forEach(function (item) {
        item.draw(context);
    })

}