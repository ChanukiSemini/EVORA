// EV Charging Session Review App - Vanilla JS Shell Logic

const CONFIG = {
    hostImageUrl: null,
    defaultImageUrl: 'https://images.unsplash.com/photo-1563720223-11003d516935?auto=format&fit=crop&w=1200&q=80'
};

document.addEventListener('DOMContentLoaded', () => {
    setupStationImage();
    setupDrawerNavigation();
    setupPageLinks();
});

function setupStationImage() {
    const stationImg = document.getElementById('station-hero-image');
    if (!stationImg) return;

    if (CONFIG.hostImageUrl && CONFIG.hostImageUrl.trim() !== '') {
        stationImg.src = CONFIG.hostImageUrl;
        stationImg.alt = "EV Charging Station - Host Provided";
        console.log("Rendering host-provided photo:", CONFIG.hostImageUrl);
    } else {
        stationImg.src = CONFIG.defaultImageUrl;
        stationImg.alt = "EV Charging Station - Default View";
        console.log("No host image found; rendering default station fallback photo.");
    }

    stationImg.addEventListener('error', () => {
        stationImg.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"><rect width="800" height="400" fill="%2302141C"/><path d="M400 150 L430 210 L370 210 Z" fill="%233DDC97"/><text x="400" y="260" font-family="sans-serif" font-size="20" fill="%2390AFB7" text-anchor="middle">Station Charger Details</text></svg>';
    });
}

function setupDrawerNavigation() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const drawer = document.getElementById('drawer');
    const drawerCloseBtn = document.getElementById('drawer-close');

    if (!hamburgerBtn || !drawerOverlay || !drawer || !drawerCloseBtn) return;

    const openDrawer = () => {
        drawer.classList.add('open');
        drawerOverlay.classList.add('open');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        drawer.querySelector('.drawer-nav-item')?.focus();
    };

    const closeDrawer = () => {
        drawer.classList.remove('open');
        drawerOverlay.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        hamburgerBtn.focus();
    };

    hamburgerBtn.addEventListener('click', openDrawer);
    drawerCloseBtn.addEventListener('click', closeDrawer);
    drawerOverlay.addEventListener('click', (e) => {
        if (e.target === drawerOverlay) closeDrawer();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('open')) {
            closeDrawer();
        }
    });
}

function setupPageLinks() {
    const drawerItems = document.querySelectorAll('.drawer-nav-item:not(.logout)');
    const sidebarItems = document.querySelectorAll('.nav-link:not(.logout)');

    const handleNavClick = (e, items) => {
        const targetText = e.currentTarget.textContent.trim();
        if (targetText !== "Rate Your Charging Session") {
            e.preventDefault();
            console.log(`Navigating to mocked area: ${targetText}`);
            alert(`Mock action: Navigating to page "${targetText}"`);
        }
    };

    drawerItems.forEach(item => {
        item.addEventListener('click', (e) => handleNavClick(e, drawerItems));
    });

    sidebarItems.forEach(item => {
        item.addEventListener('click', (e) => handleNavClick(e, sidebarItems));
    });

    const profileSnippet = document.getElementById('sidebar-profile-snippet');
    const drawerProfileSnippet = document.getElementById('drawer-profile-snippet');

    const goToProfile = () => {
        console.log("Navigating to Profile settings");
        alert("Mock action: Navigating to My Profile (Personal Details/Settings)");
    };

    if (profileSnippet) profileSnippet.addEventListener('click', goToProfile);
    if (drawerProfileSnippet) drawerProfileSnippet.addEventListener('click', goToProfile);
}

window.setHostImage = (url) => {
    CONFIG.hostImageUrl = url;
    setupStationImage();
};
