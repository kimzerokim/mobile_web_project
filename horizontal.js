(function init() {
    var screenHeight = window.innerHeight;

    function layoutFitting() {
        var statusBar = document.getElementById('statusBar'),
            feedField = document.getElementById('feedFlow'),
            tabBar = document.getElementById('tabBar');

        statusBar.style.height = '44px';
        tabBar.style.height = '50px';
        feedField.style.height = (screenHeight-parseInt(tabBar.style.height, 10)
            - parseInt(statusBar.style.height, 10)) + 'px';
    }

    layoutFitting();
})();