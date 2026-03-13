document.addEventListener('DOMContentLoaded', () => {
    // --- 3D WebGL Sun Splash Screen (Three.js) ---
    const splashScreen = document.getElementById('splash-screen');
    const canvas = document.getElementById('bg-canvas');
    
    if (splashScreen && canvas && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        // Navy blue background matching CSS
        scene.background = new THREE.Color('#081121');

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30;

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // 1. The 3D Sun Sphere
        const sunGeometry = new THREE.SphereGeometry(15, 64, 64);
        const sunMaterial = new THREE.MeshStandardMaterial({
            color: 0xFF8C00, // Vibrant Orange
            emissive: 0xFF3500, // Deep fiery core
            emissiveIntensity: 1.1,
            roughness: 0.3,
            metalness: 0.2,
            wireframe: false
        });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        sun.position.y = -3; // Closer to the center to perfectly frame the logo
        scene.add(sun);

        // Enhance the sun with an outer glow
        const glowGeometry = new THREE.SphereGeometry(17, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xFF7D00,
            transparent: true,
            opacity: 0.18,
            blending: THREE.AdditiveBlending
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.copy(sun.position);
        scene.add(glow);

        // 2. Solar Dust / Particles (Dense & Multi-colored)
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 1500;
        const posArray = new Float32Array(particlesCount * 3);
        const colorArray = new Float32Array(particlesCount * 3);

        const color1 = new THREE.Color(0xFFCB77); // Yellowish
        const color2 = new THREE.Color(0xFF6B00); // Deep Orange
        const color3 = new THREE.Color(0xFFFFFF); // Brilliant White

        for (let i = 0; i < particlesCount * 3; i+=3) {
            // Spread particles intensely around the entire 3D space
            posArray[i] = (Math.random() - 0.5) * 100;
            posArray[i+1] = (Math.random() - 0.5) * 100;
            posArray[i+2] = (Math.random() - 0.5) * 100;

            const randColor = Math.random();
            let c = color1;
            if (randColor > 0.8) c = color3;
            else if (randColor > 0.4) c = color2;
            
            colorArray[i] = c.r;
            colorArray[i+1] = c.g;
            colorArray[i+2] = c.b;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.25,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending
        });
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // 3. Lighting
        const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.2);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xFFFFFF, 1.5, 100);
        pointLight.position.set(10, 10, 10);
        scene.add(pointLight);

        // --- Interactive Mouse/Touch Tracking ---
        let targetX = 0;
        let targetY = 0;
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        const onDocumentMouseMove = (event) => {
            targetX = (event.clientX - windowHalfX) * 0.002;
            targetY = (event.clientY - windowHalfY) * 0.002;
        };
        const onDocumentTouchMove = (event) => {
            if (event.touches.length === 1) {
                targetX = (event.touches[0].pageX - windowHalfX) * 0.002;
                targetY = (event.touches[0].pageY - windowHalfY) * 0.002;
            }
        };

        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('touchmove', onDocumentTouchMove, { passive: true });

        // 4. Animation Loop
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            // Smoothly interpolate the sun's rotation towards the mouse target
            sun.rotation.y += 0.05 * (targetX - sun.rotation.y) + 0.002; // Base rotation + mouse tracking
            sun.rotation.x += 0.05 * (targetY - sun.rotation.x) + 0.001; 
            
            // Pulse the glow and track slightly
            glow.scale.setScalar(1 + Math.sin(elapsedTime * 2) * 0.02);
            glow.position.x += 0.05 * (targetX * 5 - glow.position.x);
            glow.position.y += 0.05 * (-targetY * 5 - 5 - glow.position.y); // Anchor near y=-5

            // Subtly parallax the camera
            camera.position.x += (targetX * 10 - camera.position.x) * 0.02;
            camera.position.y += (-targetY * 10 - camera.position.y) * 0.02;
            camera.lookAt(scene.position);

            // Rotate solar dust slowly and add slight parallax
            particlesMesh.rotation.y = elapsedTime * 0.05 + (targetX * 0.5);
            particlesMesh.rotation.x = elapsedTime * 0.02 + (targetY * 0.5);

            renderer.render(scene, camera);
        }
        animate();

        // Handle Resize
        const updateCameraPos = () => {
            const width = window.innerWidth;
            if (width < 480) {
                camera.position.z = 60; // Pull back further for small phones
            } else if (width < 768) {
                camera.position.z = 45; // Pull back for tablets
            } else {
                camera.position.z = 30; // Original desktop
            }
        };
        updateCameraPos();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            updateCameraPos();
        });

        // Hide splash screen after 4.5 seconds to appreciate the 3D anim
        setTimeout(() => {
            splashScreen.classList.add('hidden');
            // Clean up event listeners after splash is gone
            document.removeEventListener('mousemove', onDocumentMouseMove);
            document.removeEventListener('touchmove', onDocumentTouchMove);
            // Optional: stop rendering completely to save CPU after it's hidden
            setTimeout(() => { scene.remove.apply(scene, scene.children); }, 1000);
        }, 5500); // Extended slightly to let users play with the mouse
    }

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when a link is clicked
    const mobileLinks = document.querySelectorAll('.mobile-menu a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            document.body.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('scrolled');
            document.body.classList.remove('nav-scrolled');
        }
    });

    // Tech Reveal Animation (Fast sliding from the left)
    const revealElements = document.querySelectorAll('.reveal-slide');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // One-time execution
            }
        });
    };

    const revealOptions = {
        threshold: 0.10,
        rootMargin: "0px 0px -20px 0px" // Triggers slightly earlier
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    


    // Terminal Form Mock Manipulation
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');

    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // disable button
            submitBtn.disabled = true;
            submitBtn.innerHTML = '> EXECUTING...';
            
            // Form formatting
            formStatus.className = 'form-status p-2 text-xs monospaced border mb-2 border-accent text-accent mt-4';
            formStatus.innerHTML = '> INITIALIZING SECURE HANDSHAKE...';
            formStatus.classList.remove('hidden');

            // Simulate Terminal processing steps
            setTimeout(() => { formStatus.innerHTML += '<br>> VALIDATING PAYLOAD...'; }, 500);
            setTimeout(() => { formStatus.innerHTML += '<br>> TRANSMITTING TO ROOT_SERVER...'; }, 1000);

            setTimeout(() => {
                formStatus.className = 'form-status p-2 text-xs monospaced border mb-2 border-green text-green mt-4';
                formStatus.style.borderColor = '#00ff00';
                formStatus.style.color = '#00ff00';
                formStatus.innerHTML += '<br>> <span style="color:#white">TRANSMISSION OK.</span> ACKNOWLEDGED. EXPECT REPLY IN T-24H.';
                
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'EXECUTE_TRANSMISSION <i data-lucide="terminal" class="icon-sm"></i>';
                lucide.createIcons();
                
                // Keep the success message visible for longer
                setTimeout(() => {
                    formStatus.classList.add('hidden');
                    formStatus.innerHTML = '';
                    formStatus.style = ''; // Reset inline styles
                }, 8000);

            }, 2000);
        });
    }
});


// carousel about - us (Smooth Infinite Loop + Buttons)
document.addEventListener("DOMContentLoaded", function() {
    const track = document.querySelector(".about-track");
    let slides = Array.from(document.querySelectorAll(".about-track img"));
    const nextBtn = document.querySelector(".about-btn.next");
    const prevBtn = document.querySelector(".about-btn.prev");

    if (!track || slides.length === 0) return;

    let index = 1;
    let isTransitioning = false;
    let autoPlayInterval;

    // 1. Clone first and last images for infinite loop effect
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);

    firstClone.id = "first-clone";
    lastClone.id = "last-clone";

    track.appendChild(firstClone);
    track.insertBefore(lastClone, slides[0]);

    // Re-select slides to include clones
    slides = Array.from(document.querySelectorAll(".about-track img"));

    // 2. Initial Setup: get client width of single image
    const getSlideWidth = () => slides[0].getBoundingClientRect().width;
    
    // Start at the real first slide (index 1)
    track.style.transform = `translateX(-${getSlideWidth() * index}px)`;

    // Update width on resize
    window.addEventListener('resize', () => {
        track.classList.add("no-transition");
        track.style.transform = `translateX(-${getSlideWidth() * index}px)`;
    });

    const moveToSlide = (newIndex) => {
        if (isTransitioning) return;
        isTransitioning = true;
        
        index = newIndex;
        // Remove no-transition class to animate
        track.classList.remove("no-transition");
        track.style.transform = `translateX(-${getSlideWidth() * index}px)`;
    };

    // 3. Handle End of Transitions (The "Trick")
    track.addEventListener("transitionend", () => {
        isTransitioning = false;

        // If we reached the clone of the first slide (moving right)
        if (slides[index].id === "first-clone") {
            track.classList.add("no-transition"); // Disable animation
            index = 1; // Snap back to the real first slide
            track.style.transform = `translateX(-${getSlideWidth() * index}px)`;
        }
        
        // If we reached the clone of the last slide (moving left)
        if (slides[index].id === "last-clone") {
            track.classList.add("no-transition"); // Disable animation
            index = slides.length - 2; // Snap back to the real last slide
            track.style.transform = `translateX(-${getSlideWidth() * index}px)`;
        }
    });

    // 4. Button Controls
    const startAutoPlay = () => {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => {
            moveToSlide(index + 1);
        }, 3000);
    };

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            moveToSlide(index + 1);
            startAutoPlay(); // Reset timer on click
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            moveToSlide(index - 1);
            startAutoPlay(); // Reset timer on click
        });
    }

    // 5. Auto Play
    startAutoPlay();

    // Pause on hover
    const carouselContainer = document.querySelector('.about-carousel');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        carouselContainer.addEventListener('mouseleave', startAutoPlay);
    }
});


// slide on hero bar

document.addEventListener("DOMContentLoaded",()=>{

const track=document.querySelector(".hero-track");
const slides=document.querySelectorAll(".hero-slide");

const next=document.querySelector(".hero-btn.next");
const prev=document.querySelector(".hero-btn.prev");

let index=0;
const total=slides.length;

function move(){
track.style.transition="transform 0.6s ease";
track.style.transform=`translateX(-${index*100}%)`;
}

next.addEventListener("click",()=>{

index++;
move();

if(index===total-1){

setTimeout(()=>{
track.style.transition="none";
index=0;
track.style.transform=`translateX(0)`;
},600);

}

});

prev.addEventListener("click",()=>{

if(index<=0){
index=total-2;
track.style.transition="none";
track.style.transform=`translateX(-${index*100}%)`;
}

index--;
move();

});

setInterval(()=>{

index++;
move();

if(index===total-1){

setTimeout(()=>{
track.style.transition="none";
index=0;
track.style.transform=`translateX(0)`;
},600);

}

},4000);

});