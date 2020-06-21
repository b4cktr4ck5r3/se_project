let processId = 1;
let processWidth = 50;
let processHeight = 50;
let selectedColor = 'rgb(138, 148, 226)';
let baseColor = 'rgb(138, 43, 226)';
let bgColor = 'rgb(248, 249, 250)';

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
      this.elements.forEach(e => e.onkeydown(evt, this.ctx));
    }
  }

  onkeyup(evt) {
    if (evt.key == "Control") {
      this.select_control_down = false;
      this.elements.forEach(e => e.onkeyup(evt, this.ctx));
    }
  }

  isInNext(element, test_element) {
    if (element.link.length == 0) return false;
    else if (element.link.includes(test_element)) return true;
    else {
      return !element.link.every(e => !this.isInNext(e, test_element));
    }
  }

  selectProcess(tache) {
    if (!this.select_1) {
      tache.selected = true;
      this.select_1 = tache;
    }
    else if (this.select_1 != tache) {
      console.log("Create Link");
      if (this.select_1.link.find(e => e==tache)) this.select_1.link = this.select_1.link.filter(e => e!= tache);
      else if (tache.link.find(e => e==this.select_1)){
         tache.link = tache.link.filter(e => e!= this.select_1);
      }
      else {
        let boucle = tache.link.length > 0 && !tache.link.every(e => !this.isInNext(e, this.select_1));
        if (!boucle) this.select_1.link.push(tache);
      }
      this.select_1.selected = false;
      this.select_1 = null
    }
    else {
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
}

class Process {
  constructor(x, y, width, height, text, selectProcess) {
    this.type = "rect"
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.text = text;
    this.drag = false;

    this.selected = false;
    this.select_control_down = false;
    this.selectProcess = selectProcess;

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
    this.link.forEach(e => {
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2);
      ctx.lineTo(e.x + e.width / 2, e.y + e.height / 2);
      ctx.stroke();
    })
  }

  onmousedown(evt) {
    let mouse_x = evt.offsetX,
      mouse_y = evt.offsetY;
    if (this.x <= mouse_x && mouse_x <= this.x + this.width && this.y <= mouse_y && mouse_y <= this.y + this.height) {
      if (this.select_control_down) {
        this.selectProcess(this);
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

function init() {
  new Canvas();
}