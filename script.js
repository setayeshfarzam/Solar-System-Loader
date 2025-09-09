const starsContainer = document.querySelector('.stars');
const numStars = 300;

for (let i = 0; i < numStars; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    const size = Math.random() * 2 + 1;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.top = Math.random() * 100 + 'vh';
    star.style.left = Math.random() * 100 + 'vw';
    starsContainer.appendChild(star);
}

const loader = document.getElementById("loader");
const sun = document.getElementById("sun");
const sunPlaceholder = document.getElementById("sun-placeholder");
const welcomeText = document.getElementById("welcome-text");

const numCircles = 8;
const initialRadius = 120;
const circles = [];

let mouseX = null;
let mouseY = null;
let currentAngle = 0;
const rotationSpeed = 0.005;
const escapeRadius = 150;

const planetClasses = [
    "planet-mercury", "planet-venus", "planet-earth", "planet-mars",
    "planet-jupiter", "planet-saturn", "planet-uranus", "planet-neptune"
];

for (let i = 0; i < numCircles; i++) {
    const circle = document.createElement("div");
    circle.className = `circle ${planetClasses[i]}`;
    loader.appendChild(circle);

    circles.push({
        el: circle,
        initialAngleOffset: (i / numCircles) * Math.PI * 2,
        isScattered: false,
        scatteredX: 0,
        scatteredY: 0
    });
}

const fill = document.getElementById('fill');
let progress = 0;
let finished = false;

function getSunSize() {
    if (window.innerWidth <= 480) return '6vw';
    if (window.innerWidth <= 768) return '7vw';
    return '60px';
}

function animate() {
    if (finished) return;
    currentAngle += rotationSpeed;

    const loaderRect = loader.getBoundingClientRect();
    const centerX = loaderRect.left + loaderRect.width / 2;
    const centerY = loaderRect.top + loaderRect.height / 2;

    circles.forEach(circleObj => {
        let angle = circleObj.initialAngleOffset + currentAngle;
        let x = Math.cos(angle) * initialRadius;
        let y = Math.sin(angle) * initialRadius;

        if (mouseX !== null && mouseY !== null) {
            const dx = centerX + x - mouseX;
            const dy = centerY + y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < escapeRadius) {
                if (!circleObj.isScattered) {
                    circleObj.isScattered = true;
                    circleObj.scatteredX = (Math.random() - 0.5) * window.innerWidth;
                    circleObj.scatteredY = (Math.random() - 0.5) * window.innerHeight;
                }
            } else {
                circleObj.isScattered = false;
            }
        } else {
            circleObj.isScattered = false;
        }

        if (circleObj.isScattered) {
            x = circleObj.scatteredX;
            y = circleObj.scatteredY;
        }

        circleObj.el.style.transform = `translate(${x}px, ${y}px)`;
    });

    if (progress < 100) {
        progress += 0.1;
        fill.style.height = progress + '%';
    } else {
        finished = true;

        circles.forEach(c => c.el.style.display = 'none');

        sun.style.position = 'static';
        sun.style.margin = '0 10px';
        sun.classList.add("in-text");
        document.getElementById('fill').style.display = 'none';
        sun.style.width = getSunSize();
        sun.style.height = getSunSize();
        sunPlaceholder.appendChild(sun);

        welcomeText.classList.add('show');


        setTimeout(() => {
            document.getElementById('solar-text').classList.add('show');
        }, 1500);
    }

    requestAnimationFrame(animate);
}


document.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});


animate();
