let processId = 1;
let processWidth = 50;
let processHeight = 50;
let selectedColor = 'rgb(138, 148, 226)';
let baseColor = 'rgb(138, 43, 226)';
let bgColor = 'rgb(248, 249, 250)';

class Process {
    constructor(x, y, width, height, text, selectionnerTache, deleteProcess) {
        this.type = "rect"
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.drag = false;

        this.selected = false;
        this.select_control_down = false;
        this.selectionnerTache = selectionnerTache;
        this.deleteProcess = deleteProcess;

        this.link = [];
    }

    onkeydown(evt) {
        if (evt.key == "Control") this.select_control_down = true;
    }

    onkeyup(evt) {
        if (evt.key == "Control") this.select_control_down = false;
    }

    draw(ctx) {
        ctx.lineWidth = 3;
        if (this.selected) ctx.strokeStyle = selectedColor;
        else ctx.strokeStyle = baseColor;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        if (this.selected) ctx.fillStyle = selectedColor;
        else ctx.fillStyle = baseColor;
        ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2 + 2);

        // this.link.forEach(e => {
        //     ctx.beginPath();
        //     ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2);
        //     ctx.lineTo(e.x + e.width / 2, e.y + e.height / 2);
        //     ctx.stroke();
        // })

        this.link.forEach(e => {
        	let down = false;
          let top = false;
          let left = false;
          let right = false;
          let ref_delta = 60;
        	if (this.x > e.x-ref_delta && this.x < e.x+ref_delta) {
          	if (this.y <= e.y) top = true;
            else down = true;
          }
          else if (this.x < e.x) {
          	left = true;
          }
          else right = true;
          let line = {x0: null, y0: null, x1: null, x2: null};
          if (top) {
          	line.y0 = this.y+this.height;
            line.y1 = e.y;
          }
          else if (down) {
          	line.y0 = this.y;
            line.y1 = e.y+e.height;
          }
          else {
          	line.y0 = this.y+this.height/2;
            line.y1 = e.y+e.height/2;
          }
          
          if (left) {
          	line.x0 = this.x+this.width;
            line.x1 = e.x;
          }
          else if (right) {
          	line.x0 = this.x;
            line.x1 = e.x+e.width;
          }
          else {
          	line.x0 = this.x+this.width/2;
            line.x1 = e.x+e.width/2;
          }
          this.drawLineWithArrows(ctx, line, 10, 10, false, true);
        })
    }

    // x0,y0: the line's starting point
    // x1,y1: the line's ending point
    // width: the distance the arrowhead perpendicularly extends away from the line
    // height: the distance the arrowhead extends backward from the endpoint
    // arrowStart: true/false directing to draw arrowhead at the line's starting point
    // arrowEnd: true/false directing to draw arrowhead at the line's ending point

    drawLineWithArrows(ctx, line, aWidth, aLength, arrowStart, arrowEnd) {
        const {x0, x1, y0, y1} = line;
    var dx = x1 - x0;
    var dy = y1 - y0;
    var angle = Math.atan2(dy, dx);
    var length = Math.sqrt(dx * dx + dy * dy);
    //
    ctx.translate(x0, y0);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(length, 0);
    if (arrowStart) {
        ctx.moveTo(aLength, -aWidth);
        ctx.lineTo(0, 0);
        ctx.lineTo(aLength, aWidth);
    }
    if (arrowEnd) {
        ctx.moveTo(length - aLength, -aWidth);
        ctx.lineTo(length, 0);
        ctx.lineTo(length - aLength, aWidth);
    }
    //
    ctx.stroke();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

    onmousedown(evt) {
        let mouse_x = evt.offsetX,
            mouse_y = evt.offsetY;
        if (this.x <= mouse_x && mouse_x <= this.x + this.width && this.y <= mouse_y && mouse_y <= this.y + this.height) {
            if (this.select_control_down) {
                this.selectionnerTache(this);
            } else this.drag = true;
        }
    }

    onmousemove(evt) {
        let mouse_x = evt.offsetX,
            mouse_y = evt.offsetY;
        if (this.drag) {
            this.x = mouse_x;
            this.y = mouse_y;
        }
    }

    onmouseup(evt) {
        this.drag = false;
    }
}

class Canvas {
    constructor() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        let canvas = document.getElementById('test');
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.style.width = this.width + "px";
        canvas.style.height = this.height + "px";
        this.ctx = canvas.getContext('2d');
        this.ctx.font = 'bold 24px sans-serif';
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";

        this.elements = [];
        this.draw();

        this.select_1 = null;
        this.select_control_down = false;

        canvas.onmousedown = evt => this.onmousedown(evt);
        canvas.onmousemove = evt => this.onmousemove(evt);
        canvas.onmouseup = evt => this.onmouseup(evt);
        canvas.ondblclick = evt => this.ondblclick(evt);
        document.onkeydown = evt => this.onkeydown(evt);
        document.onkeyup = evt => this.onkeyup(evt);
    }

    onkeydown(evt) {
        if (evt.key == "Control") {
            this.select_control_down = true;
        }
        this.elements.forEach(e => e.onkeydown(evt, this.ctx));
    }

    onkeyup(evt) {
        if (this.select_1 && evt.key == "Delete") this.deleteProcess();
        else if (evt.key == "Control") {
            this.select_control_down = false;
        }
        this.elements.forEach(e => e.onkeyup(evt, this.ctx));
    }

    isInNext(element, test_element) {
        if (element.link.length == 0) return false;
        else if (element.link.includes(test_element)) return true;
        else {
            return !element.link.every(e => !this.isInNext(e, test_element));
        }
    }

    onPrevElementRecursive(element, callback) {
        let prev_elements = this.elements.filter(e => e.link.includes(element));
        prev_elements.forEach(e => {
            callback(e);
            this.onPrevElementRecursive(e, callback)
        });
    }

    deleteProcess() {
        let prev_elements = this.elements.filter(e => e.link.includes(this.select_1));
        prev_elements.forEach(e => e.link = e.link.filter(p => p != this.select_1));
        this.elements = this.elements.filter(p => p != this.select_1);
        this.select_1 = null;
        this.draw();
    }

    createLink(t1, t2) {
        if (!this.isInNext(t1, t2)) {
            t1.link.push(t2);
            t1.link = t1.link.filter(e => !this.isInNext(t2, e));
            this.onPrevElementRecursive(t2, (e) => {
                if (this.isInNext(e, t1)) {
                    e.link = e.link.filter(ele => !this.isInNext(t2, ele) && ele != t2);
                }
            })
        }
    }

    selectProcess(tache) {
        if (!this.select_1) {
            tache.selected = true;
            this.select_1 = tache;
        } else if (this.select_1 != tache) {
            console.log("Create Link");
            if (this.select_1.link.find(e => e == tache)) this.select_1.link = this.select_1.link.filter(e => e != tache);
            else if (tache.link.find(e => e == this.select_1)) {
                tache.link = tache.link.filter(e => e != this.select_1);
            } else {
                let boucle = tache.link.length > 0 && !tache.link.every(e => !this.isInNext(e, this.select_1));
                if (!boucle) this.createLink(this.select_1, tache);
            }
            this.select_1.selected = false;
            this.select_1 = null
        } else {
            this.select_1.selected = false;
            this.select_1 = null
        }
    }

    draw() {
        this.drawBackground();
        this.elements.forEach(e => e.draw(this.ctx));
    }

    drawBackground() {
        this.ctx.fillStyle = bgColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    onmousedown(evt) {
        this.elements.forEach(e => e.onmousedown(evt, this.ctx));
        this.draw();
    }
    onmouseup(evt) {
        this.elements.forEach(e => e.onmouseup(evt, this.ctx));
        this.draw();
    }
    onmousemove(evt) {
        this.elements.forEach(e => e.onmousemove(evt, this.ctx));
        this.draw();
    }

    ondblclick(evt) {
        this.elements.push(new Process(evt.offsetX, evt.offsetY, 50, 50, `T${processId}`, this.selectProcess.bind(this)));
        processId++;
        this.draw();
    }
}

function init() {
    new Canvas();
}