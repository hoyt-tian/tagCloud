;(function(window){
    'use strict';

    var TagCloud = function(tags, plugin, config){
        this.config = Object.assign( {
            parentNode: document.body,
            width: '400px',
            containerClass : null,
            containerStyle: 'position: fixed; display: flex; z-Index:100; top:10%;',
            itemClass: null,
            itemStyle: 'text-decoration: none;\
                        display: inline-block;\
                        border-radius:3px;\
                        padding:2px 4px;\
                        position: absolute;',
            plugin: plugin || TagCloud.prototype.plugins.ellpise
        }, config);

        var container = document.createElement('div');

        if(this.config.containerClass){
            container.className = this.config.containerClass;            
        }
        if(this.config.containerStyle){
            container.style = this.config.containerStyle;
        }

        this.getContainer = function(){
            return container;
        };

        var running = false;
        this.setRunning = function(val){
            running = val;
        };

        this.isRunning = function(){
            return running;
        };

        this.tagNodes = this.createTags(tags);

        this.mountTo(this.config.parentNode);        
    };

    TagCloud.prototype.plugins = {
        none:{},
        ellpise: {
            init:function(idx, tc){
                var tags = tc.tagNodes;
                this.rotate =  Math.PI / 2 * (1 + idx) / tags.length;
                this.velocity = 0.01;
                this.pos = function(t){
                    t = t || this.t;
                    var a = tc.getContainer().offsetWidth / 2;
                    var b = tc.getContainer().offsetHeight / 4;

                    var x =  a * Math.cos(t);
                    var y =  b * Math.sin(t);

                    var _x = x * Math.cos(-this.rotate) + y * Math.sin(-this.rotate);
                    var _y = y * Math.cos(-this.rotate) - x * Math.sin(-this.rotate);

                    this.style.left = _x + a + "px";
                    this.style.top = _y + a + "px";
                    this.style.opacity = Math.abs(Math.sin(t));       
                    this.style.fontSize = Math.abs(Math.sin(t)) * 2 +'em';                 
                    this.t = t + this.velocity;
                };
                this.pos( (idx+1) / tags.length * 4 * Math.PI);
            }
            ,
            move:function(){
                this.pos();
            },
            mouseover:function(tc){
                return function(){
                    this.velocity = 0.001;
                };
            },
            mouseout:function(tc){
                return function(){
                    this.velocity = 0.01;
                }
            }
        }
    };

    TagCloud.prototype.injectEvent = function(tag, config){
        tag.onmouseover = (config.mouseover)(this);

        tag.onmouseout =  (config.mouseout)(this);

        tag.init = config.init || function(){};

        tag.move = config.move || function(){};
        return tag;
    };

    TagCloud.prototype.createTags = function(tags){
        var tagNodes = [];
        tags.forEach(function(tag, index) {
            var config = Object.assign({
                mouseover:function(tc){
                    return function(){
                        tc.setRunning(false);
                    };
                },
                mouseout:function(tc){
                    return function(){
                        tc.setRunning(true);
                    };
                },
                init:function(){},
                move:function(){},
                className : this.config.itemClass,
                href:tag.href,
                style: this.config.itemStyle
            }, this.config.plugin);
            var tn = this.createTag(tag, config);

            tn.style.zIndex = tags.length - 1 - index;
            this.getContainer().appendChild(tn);
            tagNodes.push(tn);
        }, this);
        return tagNodes;
    };

    TagCloud.prototype.colors = ["#34495d", "#ee7738", "#f59d2a", "#78bbe6"];

    TagCloud.prototype.randomColor = function(){        
        return TagCloud.prototype.colors[parseInt(TagCloud.prototype.colors.length * Math.random())];
    };

    TagCloud.prototype.createTag = function(tag, config){
        var el = document.createElement('a');
        el.innerText = tag.name;
        el.href = config.href;
        el.title = tag.description || "";
        if(config.className) el.className = config.className;
        if(config.style) el.style = config.style;
        el.style.backgroundColor = TagCloud.prototype.randomColor();
        el.style.color = '#FFF';
        el.target = config.target || "_blank";
        return this.injectEvent(el, config);
    };
    /**
     * Mount Tag Cloud Container to given dom node
     */
    TagCloud.prototype.mountTo = function(domNode){
        domNode.appendChild(this.getContainer()); 
        this.getContainer().style.width = this.config.width;   
        this.getContainer().style.height = this.config.width;     
        
        this.tagNodes.forEach(function(tag, index){
            tag.init(index, this);
        }, this);
    };

    TagCloud.prototype.start = function(interval){
        this.moveInterval = interval || this.moveInterval || 60;
        this.setRunning(true);
        var f = function(tc){
            return function(){
                if(tc.isRunning()){
                     tc.tagNodes.forEach(function(tag){
                         tag.move();
                     });
                }
                tc.timerId = window.setTimeout((f)(tc), tc.moveInterval);
            }
         };
        f(this)();
    };

    window.TagCloud = TagCloud;
})(window);


