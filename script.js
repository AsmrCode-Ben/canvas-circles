let canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ctx = canvas.getContext('2d');
let colorArray = [
    '#040D12', '#183D3D', '#5C8374', '#93B1A6',
    '#F79BD3', '#EA1179', '#9F0D7F', '#241468',
    '#C70039', '#512B81', '#4477CE', '#8CABFF'
];

let mouse = {
    x: undefined,
    y: undefined
}
window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
})

function Circle(x, y, minRadius, maxRadius, dx, dy, color) {
    this.x = x;
    this.y = y;
    this.minRadius = minRadius;
    this.maxRadius = maxRadius;
    this.radiusFact = 0;
    this.radius = this.minRadius;
    this.dx = dx;
    this.dy = dy;
    this.color = color;

    this.interp = (start, end, fact) => {
        return start * (1 - fact) + end * fact;
    }

    this.draw = () => {
        ctx.fillStyle = color;
        this.updateRadius();
        this.radius = this.interp(this.minRadius, this.maxRadius, this.radiusFact);

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    this.update = () => {
        this.x += this.dx;
        this.y += this.dy;

        if (this.x + this.radius > canvas.width || this.x - this.radius < 0)
            this.dx = -this.dx;

        if (this.y + this.radius > canvas.height || this.y - this.radius < 0)
            this.dy = -this.dy;
        this.draw();
    }

    this.updateRadius = () => {
        if (Math.sqrt(Math.pow(mouse.x - this.x, 2) + Math.pow(mouse.y - this.y, 2)) < mouseRange) {
            if (this.radiusFact < 1)
                this.radiusFact += 0.05;
        } else {
            if (this.radiusFact > 0)
                this.radiusFact -= 0.1;
            if (this.radiusFact < 0) this.radiusFact = 0;
        }
    }
}

//charcters for this project
let circles = [];
let spawnFact = 0.001;
let circlesCount = Math.random() * spawnFact * canvas.width * canvas.height;
let speed = 1;
let minRadiusClamp = 2.5;
let maxRadiusClamp = 10;
let mouseRange = 100;

for (let i = 0; i < circlesCount; i++) {
    let x = Math.random() * window.innerWidth;
    let y = Math.random() * window.innerHeight;
    let dx = Math.random() * speed - speed / 2;
    let dy = Math.random() * speed - speed / 2;

    let minRadius = Math.random() * minRadiusClamp + 1;
    let maxRadius = Math.random() * maxRadiusClamp + 5;

    let color = colorArray[Math.floor(Math.random() * colorArray.length)];

    let circle = new Circle(x, y, minRadius, maxRadius, dx, dy, color);
    circle.draw();
    circles.push(circle);
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < circlesCount; i++) {
        circles[i].update();
    }
    requestAnimationFrame(animate);
}
animate();