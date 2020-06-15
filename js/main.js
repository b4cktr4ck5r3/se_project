/**
 * Classe permettant de représenter un processus.
 */
class Process{
    /**
     * Constructeur Process
     * @param {float} x 
     * @param {float} y 
     * @param {float} width 
     * @param {float} height 
     * @param {String} text 
     */
    constructor(x, y, width, height, text){
        this.type = "rect";
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
    }

    draw(ctx){
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'black';
        // ctx.fillText(this.text);
    }

    onmousedown(evt){

    }

    onmouseup(evt){

    }

    onmousemove(evt){

    }
}

/**
 * Classe permettant de représenter un dessin.
 */
class Canvas{
    /**
     * Constructeur Canvas
     */
    constructor(){
        let canvas = document.getElementById('drawZone');
        this.ctx = canvas.getContext('2d');
        this.processes = [new Process(20, 20, 50, 50, "T1")];
        this.draw();

        canvas.onmousedown = evt => this.onmousedown(evt);
        canvas.onmouseup = evt => this.onmouseup(evt);
        canvas.onmousemove = evt => this.onmousemove(evt);
    }

    draw(){
        this.drawCanvas();
        this.processes.forEach(p => p.draw(this.ctx));
    }

    drawCanvas(){
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, 30, 30);
    }

    onmousedown(evt){
        this.processes.forEach(p => p.onmousedown(evt, this.ctx));
        this.draw();
    }

    onmouseup(evt){
        this.processes.forEach(p => p.onmouseup(evt, this.ctx));
        this.draw();
    }

    onmousemove(evt){
        this.processes.forEach(p => p.onmousemove(evt, this.ctx));
        this.draw();
    }
}

/**
 * Classe permettant de représenter un lien entre deux processus.
 */
class Link{
    constructor(){

    }
}

/**
 * Fonction principale de l'application.
 */
function initApp(){
    detectCurrentElement();
    let test = new Canvas();
}

/**
 * Permet de détecter l'élément HTML que pointe le curseur de la souris.
 */
function detectCurrentElement(){
    var currentElement = null;
    document.addEventListener('mouseover', function(e){
        currentElement = e.target;
        console.log(currentElement.id);
        return currentElement.id;
    })
}

function createProcess(){
    let e = window.event;
    let x = e.clientX;
    let y = e.clientY;
    let currProcess = new Process(x, y, 300, 150, "mySquare");
}


function drawRectangle(){
    var canvas = document.createElement('canvas');
    canvas.id = "mySquare";
    canvas.width = 300;
    canvas.height = 150;
    canvas.style.zIndex = 8;
    canvas.style.position = "absolute";
    canvas.style.border = "1px solid";
    
    var element = document.getElementById('drawZone');
    element.appendChild(canvas)
    
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.rect(20, 20, 150, 150);
    ctx.stroke();
}