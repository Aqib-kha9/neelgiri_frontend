// CLEAR OLD MOCK SESSION - RUN THIS ONCE IN BROWSER CONSOLE
localStorage.clear();
sessionStorage.clear();
document.cookie.split(";").forEach(function (c) {
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
console.log("All storage cleared! Now refresh the page.");
