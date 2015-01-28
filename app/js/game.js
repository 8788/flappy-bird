/**
 * @fileOverview flappy bird
 * @authors @Bubblins(http://weibo.com/607768123)
 */

(function (window, document, undefined) {
    'use strict';
    
    var main = document.getElementById('main');
    var score = document.getElementById('score');
    var ready = document.getElementById('ready');
    var over = document.getElementById('over');
    var panel = document.getElementById('panel');
    var restart = document.getElementById('restart');

    // audio
    var start = document.getElementById('start');
    var fly = document.getElementById('fly');
    var across = document.getElementById('across');
    var end = document.getElementById('end');

    var status = 'start';
    var pillarGap = 200;    // 柱子间隙，包含宽度
    var count = 0;

    var lawn = {
        ele: document.getElementById('lawn'),
        start: function () {
            var ele = this.ele;
            var width = parseInt(util.getStyle(ele, 'width'), 10);
            var speed = 5;
            ele.timer = setInterval(function () {
                if (ele.offsetLeft < -width/2) {
                    ele.style.left = 0;
                }
                ele.style.left = ele.offsetLeft - speed + 'px';
            }, 30);            
        },
        stop: function () {
            clearInterval(this.ele.timer);
        }
    };

    var pillar = {
        ele: document.getElementById('pillar'),
        init: function () {
            var res = '';
            for (var i = 0; i < 3; i++) {
                var heights = this._randomPillarHeight();
                res += '<div class="item" style="left: ' + pillarGap * i + 'px">' + 
                    '<div class="item-up" style="height: ' + heights.up + 'px"></div>' + 
                    '<div class="item-down" style="height: ' + heights.down + 'px"></div></div>';
            }
            this.ele.innerHTML = res;
            this.ele.style.left = main.offsetWidth * 2 + 'px';
        },
        start: function () {
            var that = this;
            var ele = that.ele;
            ele.timer = setInterval(function () {
                ele.style.left = ele.offsetLeft - 4 + 'px';
                var children = ele.children;
                for (var i = 0, len = children.length; i < len; i++) {
                    if (that._check(bird, children[i])) {
                        game.over();
                    }
                    game.updateScore(that.bird, children[i]);
                }
                if (ele.offsetLeft <= -pillarGap) {
                    // clearInterval(pillar.timer);
                    var first = ele.appendChild(ele.children[0]);
                    var heights = that._randomPillarHeight();
                    first.children[0].style.height = heights.up;
                    first.children[1].style.height = heights.down;

                    that._setPillarPosition();
                    ele.style.left = 0;
                }
            }, 30);
        },
        stop: function () {
            clearInterval(this.ele.timer);
        },

        // 随机生成pillar高度
        _randomPillarHeight: function () {
            var mainHeight = main.offsetHeight;
            // gap: 140, min height: 50
            var upHeight = parseInt(Math.random() * (mainHeight - 140 - 2*70), 10) + 70;
            var downHeight = mainHeight - 140 - upHeight;
            return {
                up: upHeight,
                down: downHeight
            };            
        },

        // 设置柱子位置
        _setPillarPosition: function () {
            for (var i = 0; i < 3; i++) {
                this.ele.children[i].style.left = pillarGap * i + 'px';
            }
        },

        // 叠加检测
        _overlay: function (x1, y1, w1, h1, x2, y2, w2, h2) {
            if (x2 < x1 + w1 && x1 < x2 + x2 && y2 < y1 + h1 && y1 < y2 + h2) {
                return true;
            } else {
                return false;
            }
        },

        _check: function (bird, item) {
            var pillarLeft = pillar.ele.offsetLeft;
            var adjust = 10;     // 碰撞边缘校正
            var p1 = {
                x: item.offsetLeft + pillarLeft + adjust,
                y: 0,
                w: 69 - 2 * adjust,
                h: item.children[0].offsetHeight
            };
            var p2 = {
                x: item.offsetLeft + pillarLeft + adjust,
                y: item.children[1].offsetTop,
                w: 69 - 2 * adjust,
                h: item.children[1].offsetHeight
            };

            return this._overlay(bird.x, bird.y, bird.w, bird.h, p1.x, p1.y, p1.w, p1.h) || 
                this._overlay(bird.x, bird.y, bird.w, bird.h, p2.x, p2.y, p2.w, p2.h);
        }
    };

    var bird = {
        ele: document.getElementById('bird'),
        x: 90,
        y: 0,
        w: 44,
        h: 30,
        g: 1.5,
        jumpHeight: 60,
        fly: function () {
            var that = this;
            var ele = that.ele;
            var t = 0;
            var angle = 0;
            var v0 = Math.sqrt(2 * that.g * that.jumpHeight);   // v0*v0 = 2gh
            var old = parseInt(ele.style.bottom, 10);
            var maxBottom = main.offsetHeight - ele.offsetHeight;
            if (old >= maxBottom) { return;}
            clearInterval(ele.timer);
            ele.timer = setInterval(function () {
                t += 0.9;
                var s = v0 * t - that.g * t * t * 0.5;   // s = v0*t - 0.5*g*t*t
                var bottom = old + s;
                if (bottom <= 0) {
                    game.over();
                }

                // 计算旋转角度
                angle = parseInt(old-bottom)/2;
                angle > 90 && (angle = 90);
                angle < -30 && (angle = -30);
                that.rotate(angle);

                ele.style.bottom = bottom + 'px';
                that.y = ele.offsetTop;
            }, 30);
        },
        rotate: function (angle) {
            this.ele.style.webkitTransform = 'rotate(' + angle + 'deg)';
            this.ele.style.mozTransform = 'rotate(' + angle + 'deg)';
            this.ele.style.transform = 'rotate(' + angle + 'deg)';
        },
        died: function () {
            clearInterval(this.ele.timer);
            util.addClass(bird.ele, 'died');
            // 直接落地无动画
            if (parseInt(this.ele.style.bottom, 10) > 30) {
                util.animate(this.ele, {
                    bottom: 0
                }, {
                    duration: 500,
                    easing: 'easeIn'
                });           
            }
    
            util.animate(over, {
                top: 140
            }, {
                duration: 500,
                type: 'easeInOut'
            });

            this.rotate(90);       
        }
    };

    // 游戏音乐
    var audio = {
        start: function () {
            start.play();
        },
        fly: function () {
            fly.play();
        },
        across: function () {
            across.play();
        },
        end: function () {
            end.play();
        }
    };

    var game = {
        init: function () {
            ready.style.display = 'block';
            pillar.init();
            lawn.start();
            this.addEvent();
        },
        addEvent: function () {
            var that = this;
            util.bindEvent(document, 'keydown', function (ev) {
                var e = ev || event;
                if (e.keyCode === 32 && status !== 'over') {
                    that.paly();
                    audio.fly();
                }
            });

            util.bindEvent(document, 'touchstart', function () {
                if (status !== 'over') {
                    that.paly();
                    audio.fly();
                }
            });

            util.bindEvent(restart, 'click', function () {
                that.reset();
            });
            util.bindEvent(restart, 'touchstart', function () {
                that.reset();
            });
        },
        paly: function () {
            if (status === 'start') {
                this.start();
                status = 'play';
            }
            bird.fly();
        },
        start: function () {
            pillar.start();
            util.animate(ready, {
                opacity: 0
            }, {
                duration: 500
            });
        },
        reset: function () {
            status = 'start';
            score.style.cssText = '';
            ready.style.cssText = '';
            ready.style.display = 'block';
            over.style.cssText = '';
            bird.ele.style.bottom = '200px';
            bird.rotate(0);
            util.removeClass(bird.ele, 'died');
            score.innerHTML = 0;
            count = 0;
            this.init();
            audio.start();
        },
        over: function () {
            status = 'over';
            lawn.stop();
            pillar.stop();
            bird.died();
            audio.end();

            score.style.display = 'none';
            panel.children[0].innerHTML = count;
            try {
                var best = localStorage.getItem('flappyBirdBestScore') || 0;
                count >= best && (best = count);
                panel.children[1].innerHTML = best;
                localStorage.setItem('flappyBirdBestScore', best);        
            } catch (e) {
                panel.children[1].innerHTML = count;
            }

        },
        updateScore: function (bird, item) {
            var b = {
                x: 90
            };
            var p = {
                x: item.offsetLeft + pillar.ele.offsetLeft,
                w: 69
            };
            if (b.x > p.x && b.x <= p.x + p.w) {
                item.crossing = true;
            }
            if (b.x > p.x + p.w && item.crossing) {
                count += 1;
                item.crossing = false;
                score.innerHTML = count;
                audio.across();
            }
        }
    };

    window.game = game;

})(window, document);