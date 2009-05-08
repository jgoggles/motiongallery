jQuery.fn.motionGallery = function(options) {

    // default settings
    var options = jQuery.extend({
        restarea: 6,
        //Set width of the "neutral" area in the center of the gallery.
        maxspeed: 17,
        //Set top scroll speed in pixels. Script auto creates a range from 0 to top speed.
        maxwidth: "1000px",
        //Set to maximum width for gallery - must be less than the actual length of the image train.
        startpos: 0,
        //Set to 1 for left start, 0 for right, 2 for center.
        endofgallerymsg: ''
        //Set message to show at end of gallery.
    },
    options);


    return this.each(function() {
        // For IE - Do not edit
        var iedom = document.all || document.getElementById,
        scrollspeed = 0,
        movestate = '',
        actualwidth = '',
        cross_scroll,
        ns_scroll,
        statusdiv,
        loadedyes = 0,
        lefttime,
        righttime;

        function ietruebody() {
            return (document.compatMode && document.compatMode != "BackCompat") ? document.documentElement: document.body;
        };
        // End for IE
        function creatediv() {
            statusdiv = document.createElement("div");
            statusdiv.setAttribute("id", "statusdiv");
            document.body.appendChild(statusdiv);
            statusdiv = document.getElementById("statusdiv");
            statusdiv.innerHTML = options.endofgallerymsg;
        };

        function positiondiv() {
            var mainobjoffset = getposOffset(crossmain, "left"),
            menuheight = parseInt(crossmain.offsetHeight),
            mainobjoffsetH = getposOffset(crossmain, "top");
            statusdiv.style.left = mainobjoffset + (menuwidth / 2) - (statusdiv.offsetWidth / 2) + "px";
            statusdiv.style.top = menuheight + mainobjoffsetH + "px";
        };

        function showhidediv(what) {
            if (options.endofgallerymsg != "") {
                positiondiv();
                statusdiv.style.visibility = what;
            }
        };

        function getposOffset(what, offsettype) {
            var totaloffset = (offsettype == "left") ? what.offsetLeft: what.offsetTop;
            var parentEl = what.offsetParent;
            while (parentEl != null) {
                totaloffset = (offsettype == "left") ? totaloffset + parentEl.offsetLeft: totaloffset + parentEl.offsetTop;
                parentEl = parentEl.offsetParent;
            }
            return totaloffset;
        };

        function moveleft() {
            if (loadedyes) {
                movestate = "left";
                if (iedom && parseInt(cross_scroll.style.left) > (menuwidth - actualwidth)) {
                    cross_scroll.style.left = parseInt(cross_scroll.style.left) - scrollspeed + "px";
                    showhidediv("hidden");
                }
                else
                showhidediv("visible");
            }
            lefttime = setTimeout("moveleft()", 10);
        };

        function moveright() {
            if (loadedyes) {
                movestate = "right";
                if (iedom && parseInt(cross_scroll.style.left) < 0) {
                    cross_scroll.style.left = parseInt(cross_scroll.style.left) + scrollspeed + "px";
                    showhidediv("hidden");
                }
                else
                showhidediv("visible");
            }
            righttime = setTimeout("moveright()", 10);
        };

        // Main function called on mouseover
        function motionengine(e) {
            var mainobjoffset = getposOffset(crossmain, "left");
            var dsocx = (window.pageXOffset) ? pageXOffset: ietruebody().scrollLeft;
            var dsocy = (window.pageYOffset) ? pageYOffset: ietruebody().scrollTop;
            var curposy = (window.event) ? event.clientX: ((e.clientX) ? e.clientX: "");

            curposy -= mainobjoffset - dsocx;

            var leftbound = (menuwidth - options.restarea) / 2;
            var rightbound = (menuwidth + options.restarea) / 2;

            if (curposy > rightbound) {
                scrollspeed = (curposy - rightbound) / ((menuwidth - options.restarea) / 2) * options.maxspeed;
                clearTimeout(righttime);
                if (movestate != "left") moveleft();
            }
            else if (curposy < leftbound) {
                scrollspeed = (leftbound - curposy) / ((menuwidth - options.restarea) / 2) * options.maxspeed;
                clearTimeout(lefttime);
                if (movestate != "right") moveright();
            }
            else
            scrollspeed = 0;
        };

        function contains_ns6(a, b) {
            if (b !== null)
            while (b.parentNode)
            if ((b = b.parentNode) == a)
            return true;
            return false;
        };

        function stopmotion(e) {
            if (!window.opera || (window.opera && e.relatedTarget !== null))
            if ((window.event && !crossmain.contains(event.toElement)) || (e && e.currentTarget && e.currentTarget != e.relatedTarget && !contains_ns6(e.currentTarget, e.relatedTarget))) {
                clearTimeout(lefttime);
                clearTimeout(righttime);
                movestate = "";
            }
        };

        $(document).ready(function() {
            if (iedom) {
                // Set crossmain to the element
                crossmain = jQuery(this);
                // set the maxwidth of the element to the default at the top if it's currently not set
                // if (typeof crossmain.style.(options.maxwidth) !== 'undefined')
                crossmain.css('max-width', options.maxwidth);
                // Set the menu width.  This is currently returning the width of the element
                menuwidth = crossmain.offsetWidth;

                // set cross_scroll to the motiongallery element
                cross_scroll = jQuery("#motiongallery");

                // get the actual width of the trueContainer
                // because we're not wrapping the images, the actual width will be the sum of all the image width, give or take
                actualwidth = jQuery("#trueContainer").offsetWidth;

                // move the left style of the motiongallery element
                if (options.startpos)
                cross_scroll.style.left = (menuwidth - actualwidth) / options.startpos + 'px';

                crossmain.onmousemove = function(e) {
                    motionengine(e);
                };

                crossmain.onmouseout = function(e) {
                    stopmotion(e);
                    showhidediv("hidden");
                };
            }

            loadedyes = 1

            if (options.endofgallerymsg != "") {
                creatediv();
                positiondiv();
            }
            if (document.body.filters) {
                onresize();
            }
        });

        onresize = function() {
            if (typeof jQuery(this) !== 'undefined' && jQuery(this).filters) {
                jQuery(this).style.width = "0";
                jQuery(this).style.width = "";
                jQuery(this).style.width = Math.min(jQuery(this).offsetWidth, options.maxwidth) + 'px';
            };
            menuwidth = crossmain.offsetWidth;
            cross_scroll.style.left = options.startpos ? (menuwidth - actualwidth) / options.startpos + 'px': 0;
        };

    });

};