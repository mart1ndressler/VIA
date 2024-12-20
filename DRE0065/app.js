function updateCurrentTime()
{
    const now = new Date();
    document.getElementById('current-time').textContent = `Čas: ${now.toLocaleTimeString('cs-CZ', { hour12: false })}`;
}

let loginSeconds = parseInt(localStorage.getItem('loginSeconds')) || 0;
function updateLoginDuration() 
{
    loginSeconds++;
    localStorage.setItem('loginSeconds', loginSeconds);
    
    const hours = String(Math.floor(loginSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((loginSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(loginSeconds % 60).padStart(2, '0');
    document.getElementById('login-duration').textContent = `Doba přihlášení: ${hours}:${minutes}:${seconds}`;
}

setInterval(updateCurrentTime, 1000);
setInterval(updateLoginDuration, 1000);
updateCurrentTime();
updateLoginDuration();

let currentSlide = 0;
function showSlide(index) 
{
    const carousel = document.getElementById("carousel");
    const slides = carousel.children;
    const totalSlides = slides.length;

    if(index >= totalSlides) currentSlide = 0;
    else if(index < 0) currentSlide = totalSlides - 1;
    else currentSlide = index;
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextSlide() {showSlide(currentSlide + 1);}
function previousSlide() {showSlide(currentSlide - 1);}
document.addEventListener("DOMContentLoaded", () => {showSlide(currentSlide);});

let currentImageIndex = 0;
const images = Array.from(document.querySelectorAll('.blog-image')).map(img => img.src);
function openImageModal(image) 
{
    currentImageIndex = images.indexOf(image.src);
    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");
    modalImage.src = image.src;
    modal.style.display = "flex";
}
function closeImageModal() {document.getElementById("imageModal").style.display = "none";}

function showImageAtIndex(index) 
{
    const totalImages = images.length;
    if(index >= totalImages) currentImageIndex = 0;
    else if(index < 0) currentImageIndex = totalImages - 1;
    else currentImageIndex = index;
    document.getElementById("modalImage").src = images[currentImageIndex];
}

function nextImage() {showImageAtIndex(currentImageIndex + 1);}
function previousImage() {showImageAtIndex(currentImageIndex - 1);}

function openLoginModal() {document.getElementById('loginModal').style.display = 'flex';}
function closeLoginModal() 
{
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
}

function loginUser(event) 
{
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if(!username || !password) 
    {
        alert("Prosím, vyplňte všechna pole.");
        return;
    }

    localStorage.setItem('username', username);
    localStorage.setItem('isLoggedIn', 'true');
    displayUserInfo(username);
    closeLoginModal();
}

function openRegisterModal() {document.getElementById('registerModal').style.display = 'flex';}
function closeRegisterModal() 
{
    document.getElementById('registerModal').style.display = 'none';
    document.getElementById('registerUsername').value = '';
    document.getElementById('registerPassword').value = '';
}

function registerUser(event) 
{
    event.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const dateOfBirth = document.getElementById('registerDateOfBirth').value;
    const idNumber = document.getElementById('registerIdNumber').value;
    const password = document.getElementById('registerPassword').value;

    if(!username || !email || !dateOfBirth || !idNumber || !password) 
    {
        alert("Prosím, vyplňte všechna pole.");
        return;
    }

    localStorage.setItem('username', username);
    localStorage.setItem('isLoggedIn', 'true');
    displayUserInfo(username);
    closeRegisterModal();
}

function displayUserInfo(username) 
{
    if(username) 
    {
        document.getElementById('usernameDisplay').textContent = username;
        const profileUsernameElement = document.getElementById('profileUsername');
        if(profileUsernameElement) profileUsernameElement.textContent = username;
        document.getElementById('authButtons').style.display = 'none';
        document.getElementById('userInfo').style.display = 'flex';
        document.getElementById('logoutLink').style.display = 'inline';
    }
}

function logoutUser() 
{
    localStorage.removeItem('username');
    localStorage.setItem('isLoggedIn', 'false');
    document.getElementById('authButtons').style.display = 'flex';
    document.getElementById('userInfo').style.display = 'none';
    document.getElementById('logoutLink').style.display = 'none';
}

document.addEventListener("DOMContentLoaded", () => 
{
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const username = localStorage.getItem('username');
    if(isLoggedIn && username) displayUserInfo(username);
    else 
    {
        document.getElementById('authButtons').style.display = 'flex';
        document.getElementById('userInfo').style.display = 'none';
        document.getElementById('logoutLink').style.display = 'none';
    }
});