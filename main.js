let player;
let checkInterval;

// YouTube Setup
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        videoId: 'hx50R-jMAhQ', // WE ON GO by BIA 
        playerVars: {
            'playsinline': 1, 'controls': 0, 'disablekb': 1, 'fs': 0, 'rel': 0, 'showinfo': 0, 'modestbranding': 1, 'start': 0
        },
        events: { 'onStateChange': onPlayerStateChange }
    });
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        if (!checkInterval) {
            checkInterval = setInterval(() => {
                if (player.getCurrentTime() >= 25) {
                    player.seekTo(0);
                }
            }, 100);
        }
    } else {
        clearInterval(checkInterval);
        checkInterval = null;
    }
}

// Generate Random Hex for HUD
function generateHex() {
    let str = "";
    for(let i=0; i<10; i++) {
        str += "0x" + Math.floor(Math.random()*16777215).toString(16).toUpperCase() + "<br>";
    }
    return str + str; // duplicate for smooth scroll
}
document.getElementById('hex-scroll').innerHTML = generateHex();

// Update Timecode
setInterval(() => {
    const d = new Date();
    document.getElementById('hud-time').innerText = 
        d.getHours().toString().padStart(2, '0') + ":" + 
        d.getMinutes().toString().padStart(2, '0') + ":" + 
        d.getSeconds().toString().padStart(2, '0') + ":" + 
        Math.floor(d.getMilliseconds()/10).toString().padStart(2, '0');
}, 50);

// Typing Animation Logic
function typeText(element, text, speed, callback) {
    element.innerHTML = '';
    const cursor = document.createElement('span');
    cursor.className = 'type-cursor';
    element.appendChild(cursor);
    
    let i = 0;
    const interval = setInterval(() => {
        if (i < text.length) {
            cursor.insertAdjacentText('beforebegin', text.charAt(i));
            i++;
        } else {
            clearInterval(interval);
            if(callback) callback();
        }
    }, speed);
}

// Entrance Button
document.getElementById('enter-btn').addEventListener('click', () => {
    document.getElementById('entrance').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('entrance').classList.add('hidden');
        document.getElementById('main-content').classList.remove('hidden');
        
        // Start Music
        if (player && typeof player.playVideo === 'function') player.playVideo();
        
        // Trigger initial animations
        const blocks = document.querySelectorAll('.section-block');
        
        // Intersection Observer for Scroll Animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Trigger typing on elements inside that haven't been typed yet
                    const typeElements = entry.target.querySelectorAll('.type-text:not(.typed)');
                    typeElements.forEach(el => {
                        el.classList.add('typed');
                        typeText(el, el.getAttribute('data-text'), 50, () => {
                            // Check for delayed type elements
                            const delayed = entry.target.querySelectorAll('.type-text-delay:not(.typed)');
                            delayed.forEach(d_el => {
                                d_el.classList.add('typed');
                                typeText(d_el, d_el.getAttribute('data-text'), 30);
                            });
                        });
                    });
                }
            });
        }, { threshold: 0.1 });

        blocks.forEach(block => observer.observe(block));
        
    }, 500);
});
