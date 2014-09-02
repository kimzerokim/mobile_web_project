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
        feedField.style.height = (screenHeight - parseFloat(statusBar.style.height) - parseFloat(header.style.height)
            - parseFloat(tabBar.style.height) ) + 'px';
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
            photoField.style.height = (parseFloat(container.style.width)) + 'px';
            infoField.style.height = (parseFloat(container.style.height)
                - parseFloat(photoField.style.height)) + 'px';
            container.style.marginRight = (screenWidth / 35) + 'px';
        }
    }

    function initPosition() {
        var threadFlow = document.querySelector('#feedFlow ul'),
            threadContainer = document.getElementById('card1');

        var threadWidth = (parseFloat(threadContainer.style.width) +
                parseFloat(threadContainer.style.marginRight)),
            leftMargin = (screenWidth - threadWidth - parseFloat(threadContainer.style.marginRight)) / 2;

        threadFlow.style.left = (-2 * threadWidth + leftMargin + parseFloat(threadContainer.style.marginRight)) + 'px';
        //threadFlow.style.left = (-2 * threadWidth + parseFloat(threadContainer.style.marginRight)) + 'px';
    }

    layoutFitting();
    threadFitting();
    initPosition();
})();

var Flicking = {
    "init": function () {
        this.width = window.innerWidth;
        this.container = document.querySelector("#feedFlow ul");
        this.threadWidth = parseFloat(document.getElementById('card1').style.width) +
            parseFloat(document.getElementById('card1').style.marginRight);
        this.halfWidth = this.width / 2;
        this.finalLeft = parseFloat(this.container.style.left);
        this.touchStartX = 0;
        this.drag_dist = 0;
        this.eventBind();
    },
    "eventBind": function () {
        //touch, requestAnimationFrame
        this.container.addEventListener("touchstart", this.touchstart.bind(this));
        this.container.addEventListener("touchmove", this.touchmove.bind(this));
        this.container.addEventListener("touchend", this.touchend.bind(this));
    },
    "touchstart": function (e) {
        console.log(this.finalLeft);
        this.touchStartX = e.touches[0].pageX;
        this.container.style.left = this.finalLeft + 'px';
        this.container.style.transition = '';
        this.container.style.transform = 'translate3d(0, 0, 0)';
    },
    "touchmove": function (e) {
        e.preventDefault();
        this.drag_dist = e.changedTouches[0].pageX - this.touchStartX;
        this.container.style.left = this.finalLeft + this.drag_dist + 'px';
    },
    "touchend": function (e) {
        if (Math.abs(this.drag_dist) > this.halfWidth * 0.5) {
            if (this.drag_dist < 0) {
                //left
                this.animate(-(this.threadWidth + this.drag_dist));
                this.swapCard('left');
            } else {
                //right
                this.animate(this.threadWidth - this.drag_dist);
                this.swapCard('right');
            }
        } else {
            //console.log('go back')
            this.animate(-this.drag_dist);
        }
        this.touchStartX = 0;
        this.drag_dist = 0;
    },
    "animate": function (distance) {
        this.container.style.transition = 'transform 0.3s ease-in-out';
        this.container.style.transform = 'translate3d(' + distance + 'px, 0, 0)';
    },
    "swapCard": function (direction) {
        var threadFlowLeft = parseFloat(this.container.style.left),
            threadList = document.getElementsByClassName('threadContainer'),
            firstElement = threadList[0],
            lastElement = threadList[4];

        if (direction === 'left') {
            var duplicateNode = firstElement.cloneNode(true);
            this.container.appendChild(duplicateNode);
            this.container.style.left = (threadFlowLeft + this.threadWidth) + 'px';
            this.container.removeChild(firstElement);
        } else if (direction === 'right') {
            var duplicateNode = lastElement.cloneNode(true);
            this.container.insertBefore(duplicateNode, firstElement);
            this.container.style.left = (threadFlowLeft - this.threadWidth) + 'px';
            this.container.removeChild(lastElement);
        }
    }
};

Flicking.init();