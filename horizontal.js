(function init() {
    var screenHeight = window.innerHeight,
        screenWidth = window.innerWidth;

    function layoutFitting() {
        var statusBar = document.getElementById('statusBar'),
            header = document.getElementById('header'),
            feedField = document.getElementById('feedFlow'),
            tabBar = document.getElementById('tabBar');

        //statusBar.style.height = (screenHeight / 12.8) + 'px';
        statusBar.style.height = '0px';
        header.style.height = (screenHeight / 3.8) + 'px';
        tabBar.style.height = (screenHeight / 9.2) + 'px';
        feedField.style.height = (screenHeight - parseInt(statusBar.style.height, 10) - parseInt(header.style.height, 10)
            - parseInt(tabBar.style.height, 10) ) + 'px';
    }

    function threadFitting() {
        var threadFlow = document.querySelector('#feedFlow ul'),
            threadContainer = document.getElementsByClassName('threadContainer'),
            containerLength = threadContainer.length;

        threadFlow.style.width = (4.1 * screenWidth) + 'px';

        for (var i = 0; i < containerLength; i++) {
            var container = threadContainer[i],
                photoField = container.getElementsByClassName('threadPhoto')[0],
                infoField = container.getElementsByClassName('threadInfo')[0];

            container.style.width = (screenWidth / 1.3) + 'px';
            container.style.height = (screenWidth / 1.1) + 'px';
            photoField.style.height = (parseInt(container.style.width, 10)) + 'px';
            infoField.style.height = (parseInt(container.style.height, 10)
                - parseInt(photoField.style.height, 10)) + 'px';
            console.log(infoField);
            container.style.marginLeft = (screenWidth / 55) + 'px';
            container.style.marginRight = (screenWidth / 55) + 'px';
        }
    }

    layoutFitting();
    threadFitting();
})();

function onDeviceReady() {
    if (parseFloat(window.device.version) >= 7.0) {
        document.body.style.marginTop = "20px";
        // OR do whatever layout you need here, to expand a navigation bar etc
    }
}

document.addEventListener('deviceready', onDeviceReady, false);