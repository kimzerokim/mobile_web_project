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
            container.style.marginRight = (screenWidth / 35) + 'px';
        }
    }

    function initPosition() {
        var threadFlow = document.querySelector('#feedFlow ul'),
            representContainer = document.getElementById('card1');

        var threadWidth = (parseInt(representContainer.style.width) +
            parseInt(representContainer.style.marginRight));

        var leftMargin = (screenWidth - threadWidth - parseInt(representContainer.style.marginRight)) / 2;

        threadFlow.style.left = (-2 * threadWidth + leftMargin + parseInt(representContainer.style.marginRight)) + 'px';
    }

    layoutFitting();
    threadFitting();
    initPosition();
})();

var Flicking = {
    "init": function () {
        this.index = 0;
        this.width = window.innerWidth;
        this.halfWidth = this.width / 2;
        this.currentLeft = 0;
        this.touchStartX = 0;
        this.drag_dist = 0;
        this.container = document.querySelector("#feedFlow ul");
        this.eventBind();
    },
    "eventBind": function () {
        //touch, requestAnimationFrame
        this.container.addEventListener("touchstart", this.touchstart.bind(this));
        this.container.addEventListener("touchmove", this.touchmove.bind(this));
        this.container.addEventListener("touchend", this.touchend.bind(this));
    },
    "touchstart": function (e) {
        touchStartX = e.touches[0].pageX
        this.container.style.left = this.currentLeft + 'px'
        this.container.style.transition = ''
        this.container.style.transform = ''
    },
    "touchmove": function (e) {
        e.preventDefault()
        this.drag_dist = e.changedTouches[0].pageX - touchStartX
        this.container.style.left = this.currentLeft + this.drag_dist + 'px'
    },
    "touchend": function (e) {
        var leftString = this.container.style.left
        var leftValue = parseInt(leftString.substring(0, leftString.length - 2))
        this.currentLeft = leftValue
        if (Math.abs(this.drag_dist) > this.halfWidth) {
            if (this.drag_dist < 0) {
                //console.log('next page to the right')
                SwapCard('left');
                this.index++
                var finalLeft = -(this.index) * (this.width)
                this.animate(-(this.width + this.drag_dist))
                this.currentLeft = finalLeft
            } else {
                //console.log('next page to the left')
                SwapCard('right');
                this.index--;
                var finalLeft = -(this.index) * (this.width);
                this.animate(this.width - this.drag_dist);
                this.currentLeft = finalLeft;
            }
        } else {
            //console.log('go back')
            var finalLeft = -(this.index) * (this.width)
            this.currentLeft = finalLeft
            this.animate(-this.drag_dist)
        }
        this.touchStartX = 0;
        this.drag_dist = 0;
    },
    "animate": function (distance) {
        this.container.style.transition = 'transform 0.3s ease-in-out'
        this.container.style.transform = 'translate3d(' + distance + 'px, 0, 0)'
    }
};

Flicking.init();

var SwapCard = function (direction) {
    var threadFlow = document.querySelector('#feedFlow ul'),
        firstElement = threadFlow.firstChild.nextSibling,
        lastElement = threadFlow.lastChild.previousSibling;

    if (direction === 'left') {
        var dupnode = firstElement.cloneNode(true);
        threadFlow.appendChild(dupnode);
    } else if (direction === 'right') {
        threadFlow.insertBefore(lastElement, threadFlow.childNodes[1]);
    }
};