document.addEventListener('DOMContentLoaded', () => {
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


// carousel

document.addEventListener("DOMContentLoaded", function(){

const track = document.querySelector(".carousel-track");
const slides = document.querySelectorAll(".carousel-track img");

let index = 0;

setInterval(() => {

index++;

if(index >= slides.length){
index = 0;
}

track.style.transform = `translateX(-${index * 100}%)`;

}, 4000);

});


// slide on hero bar

document.addEventListener("DOMContentLoaded",()=>{

const track=document.querySelector(".hero-track");
const slides=document.querySelectorAll(".hero-slide");

const next=document.querySelector(".next");
const prev=document.querySelector(".prev");

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