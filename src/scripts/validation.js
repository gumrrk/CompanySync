const isAdm = localStorage.getItem('isAdm');

if (isAdm != null) {
    if (isAdm === 'y') {
        if (!window.location.pathname.includes('adminpage.html')) {
            window.location.href = '../../src/pages/adminpage.html';
        }
    } else {
        if (!window.location.pathname.includes('userpage.html')) {
            window.location.href = '../../src/pages/userpage.html';
        }
    }
} else {
    if (!window.location.pathname.includes('login.html')) {
        window.location.href = '../../src/pages/login.html';
    }
}
