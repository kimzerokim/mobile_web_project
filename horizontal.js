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
        header.style.height = (screenHeight / 3.4) + 'px';
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
                photoField = container.getElementsByClassName('threadPhoto'),
                infoField = container.getElementsByClassName('threadInfo');

            container.style.width = (screenWidth / 1.3) + 'px';
            container.style.height = (screenWidth / 1.1) + 'px';
            container.style.marginRight = (screenWidth / 35) + 'px';

            photoField[0].style.height = (parseFloat(container.style.width)) + 'px';
            infoField[0].style.height = (parseFloat(container.style.height)
                - parseFloat(photoField[0].style.height)) + 'px';

            photoField[1].style.height = (parseFloat(container.style.width)) + 'px';
            infoField[1].style.height = (parseFloat(container.style.height)
                - parseFloat(photoField[1].style.height)) + 'px';
        }
    }

    function initPosition() {
        var threadFlow = document.querySelector('#feedFlow ul'),
            threadContainer = document.getElementById('card1');

        var threadWidth = (parseFloat(threadContainer.style.width) +
                parseFloat(threadContainer.style.marginRight)),
            leftMargin = (screenWidth - threadWidth - parseFloat(threadContainer.style.marginRight)) / 2;

        threadFlow.style.left = (-2 * threadWidth + leftMargin + parseFloat(threadContainer.style.marginRight)) + 'px';
    }

    layoutFitting();
    threadFitting();
    initPosition();
})();

var Flicking = {
    init: function () {
        this.width = window.innerWidth;
        this.halfWidth = this.width / 2;
        this.threadWidth = parseFloat(document.getElementById('card1').style.width) +
            parseFloat(document.getElementById('card1').style.marginRight);
        this.container = document.querySelector("#feedFlow ul");
        this.container.style.webkitTransition = '-webkit-transform 0.3s ease-in-out';
        this.container.style.webkitTransform = 'translate3d(0, 0, 0)';
        this.cardList = ['card1', 'card2', 'card3', 'card4', 'card5'];
        this.finalLeft = 0;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.dragX = 0;
        this.dragY = 0;
        this.sideDrag = false;
        this.upDrag = false;
        this.touchEventBind();
    },
    cardFlip: function (e) {
        var card = e.target.parentNode.parentNode.parentNode;
        card.classList.add('flipped');
    },
    cardReflip: function (e) {
        var card = e.target.parentNode.parentNode.parentNode;
        card.classList.remove('flipped');
    },
    touchEventBind: function () {
        this.container.addEventListener("touchstart", this.touchStart.bind(this));
        this.container.addEventListener("touchmove", this.touchMove.bind(this));
        this.container.addEventListener("touchend", this.touchEnd.bind(this));
        this.cardList.forEach(function (cardName) {
            var card = document.getElementById(cardName),
                moreButton_front = card.childNodes[1].childNodes[3].childNodes[1],
                moreButton_back = card.childNodes[3].childNodes[3].childNodes[1];
            moreButton_front.addEventListener('click', Flicking.cardFlip.bind(Flicking));
            moreButton_back.addEventListener('click', Flicking.cardReflip.bind(Flicking));
        });
    },
    touchStart: function (e) {
        this.touchStartX = e.touches[0].pageX;
        this.touchStartY = e.touches[0].pageY;
        this.animate(this.finalLeft);
    },
    touchMove: function (e) {
        e.preventDefault();
        this.dragX = e.changedTouches[0].pageX - this.touchStartX;
        this.dragY = e.changedTouches[0].pageY - this.touchStartY;
        this.detectDirection(this.dragX, this.dragY);
    },
    detectDirection: function (x, y) {
        var upSlope = Math.abs(window.innerHeight / (window.innerWidth / 2)),
            sideSlope = Math.abs((window.innerHeight / 2) / window.innerWidth),
            userSlope = Math.abs(y / x),
            distance = Math.sqrt(x * x + y * y);

        if (distance > 4 && userSlope >= upSlope) {
            this.upDrag = true;
        } else if (sideSlope >= userSlope) {
            this.sideDrag = true;
            this.animate(this.finalLeft + this.dragX);
        } else {
            this.upDrag = false;
            this.sideDrag = false;
        }
    },
    touchEnd: function (e) {
        var touchElement = e.changedTouches[0].target.parentNode;
        if (touchElement === document.getElementById('feedFlow')) {
            touchElement = null;
        }
        if (this.upDrag === true && touchElement != null) {
            this.deleteCard(touchElement);
        } else if (this.sideDrag === true) {
            if (Math.abs(this.dragX) > this.halfWidth * 0.5) {
                if (this.dragX < 0) {
                    //left
                    this.animate(this.finalLeft - this.threadWidth);
                    this.finalLeft -= this.threadWidth;
                    this.swapCard('left');
                } else {
                    //right
                    this.animate(this.finalLeft + this.threadWidth);
                    this.finalLeft += this.threadWidth;
                    this.swapCard('right');
                }
            } else {
                this.animate(this.finalLeft);
            }
        }
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.dragX = 0;
        this.dragY = 0;
        this.upDrag = false;
        this.sideDrag = false;
    },
    animate: function (distance) {
        this.container.style.webkitTransform = 'translate3d(' + distance + 'px, 0, 0)';
    },
    swapCard: function (direction) {
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
    },
    deleteCard: function (touchElement) {
        var duplicateNode = touchElement.cloneNode(true);
        this.container.removeChild(touchElement);
        this.container.appendChild(duplicateNode);
    }
};

Flicking.init();