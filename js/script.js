document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('snow-canvas');
    const ctx = canvas.getContext('2d');
    const cursor = document.querySelector('.cursor');
    const statusElement = document.querySelector('.status');

    const statuses = ["Infosec Engineer", "Google Product Expert", "Programmer", "Komaru Cat?"];
    let currentStatusIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const delayBetweenStatuses = 2000;

    function typeStatus() {
        const currentStatus = statuses[currentStatusIndex];
        if (!isDeleting && currentCharIndex < currentStatus.length) {
            statusElement.textContent = currentStatus.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            setTimeout(typeStatus, typingSpeed);
        } else if (isDeleting && currentCharIndex > 0) {
            statusElement.textContent = currentStatus.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            setTimeout(typeStatus, deletingSpeed);
        } else if (!isDeleting && currentCharIndex === currentStatus.length) {
            setTimeout(() => {
                isDeleting = true;
                typeStatus();
            }, delayBetweenStatuses);
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentStatusIndex = (currentStatusIndex + 1) % statuses.length;
            setTimeout(typeStatus, typingSpeed);
        }
    }

    setTimeout(typeStatus, 500);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const snowflakes = [];

    function createSnowflake() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speed: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.5 + 0.5,
            wind: Math.random() * 0.3 - 0.15,
            vx: 0,
            vy: 0
        };
    }

    for (let i = 0; i < 80; i++) {
        snowflakes.push(createSnowflake());
    }

    function drawSnowflakes() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        snowflakes.forEach((flake, index) => {
            ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
            ctx.beginPath();
            ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
            ctx.fill();

            flake.y += flake.speed + flake.vy;
            flake.x += flake.wind + flake.vx;
            flake.vx *= 0.95;
            flake.vy *= 0.95;

            if (flake.y > canvas.height || flake.x < 0 || flake.x > canvas.width) {
                snowflakes[index] = createSnowflake();
                snowflakes[index].y = 0;
                snowflakes[index].x = Math.random() * canvas.width;
            }
        });
    }

    canvas.addEventListener('click', (e) => {
        const clickX = e.clientX;
        const clickY = e.clientY;
        snowflakes.forEach((flake) => {
            const dx = flake.x - clickX;
            const dy = flake.y - clickY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                const force = (100 - distance) / 100;
                flake.vx += (dx / distance) * force * 10;
                flake.vy += (dy / distance) * force * 10;
            }
        });
    });

    function animate() {
        drawSnowflakes();
        requestAnimationFrame(animate);
    }

    animate();

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX - 10}px`;
        cursor.style.top = `${e.clientY - 10}px`;
    });

    document.querySelectorAll('.social-icon').forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
        });
        icon.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
        });
    });
});