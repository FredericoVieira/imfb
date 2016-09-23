var width = 960, height = 500;
var m = 12, degrees = 180 / Math.PI;
var svg, g, spermatozoa = [];

/*function addnSzoid(n){
    var spermatozoid = d3.range(n).map(function() {
    var x = Math.random() * width,
        y = Math.random() * height;
    return {
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 2 - 1,
        path: d3.range(m).map(function() { return [x, y]; }),
        count: 0
        };
    });
    return spermatozoid;
}*/

function showMessage(message) {
    $("#alert").removeClass("hide").addClass("in");
    $("#alert strong").text(message);
    window.setTimeout(function () {
        $("#alert").addClass("hide")
    },5000);
}

function cleanScreen(){
    var headNowValue, headBeforeValue, headBefore = [];

    $('ellipse').each(function() {
        headBeforeValue = ($(this)[0].transform.baseVal[0].matrix.e + $(this)[0].transform.baseVal[0].matrix.f) / 2;
        headBefore.push(headBeforeValue);
    });

    setInterval(function () {
        $('ellipse').each(function(i) {
            headNowValue = ($(this)[0].transform.baseVal[0].matrix.e + $(this)[0].transform.baseVal[0].matrix.f) / 2;
            if (headNowValue == headBefore[i]){
                $(this)[0].remove();
            };
        });
    },50);
}

function updateScreen(){
    draw();
    setInterval(function () {
        cleanScreen();
    },50);
}

function addSzoid(){
    var spermatozoid = {};
    var x = Math.random() * width,
        y = Math.random() * height;
    spermatozoid['vx'] = Math.random() * 2 - 1;
    spermatozoid['vy'] = Math.random() * 2 - 1;
    spermatozoid['path'] = d3.range(m).map(function() { return [x, y]; });
    spermatozoid['count'] = 0;
    return spermatozoid;
}

function draw(){
    g = svg.selectAll("g").data(spermatozoa); //Re-bind data
    g.enter().append("g");
    g.exit().remove();

    var head = g.append("ellipse")
        .attr("rx", 6.5)
        .attr("ry", 4);

    g.append("path")
        .datum(function(d) { return d.path.slice(0, 3); })
        .attr("class", "mid");

    g.append("path")
        .datum(function(d) { return d.path; })
        .attr("class", "tail");

    var tail = g.selectAll("path");

    var t = d3.timer(function(elapsed) {
        $("#add-szoid, #kill-random-szoid, #refresh-szoid").click(function() {
            t.restart(function(){});
        });

        head.attr("transform", headTransform);
        tail.attr("d", tailPath);

        for (var i = -1; ++i < spermatozoa.length;) {
            var spermatozoon = spermatozoa[i],
                path = spermatozoon.path,
                dx = spermatozoon.vx,
                dy = spermatozoon.vy,
                x = path[0][0] += dx,
                y = path[0][1] += dy,
                speed = Math.sqrt(dx * dx + dy * dy),
                count = speed * 10,
                k1 = -5 - speed / 3;

            // Bounce off the walls.
            if (x < 0 || x > width) spermatozoon.vx *= -1;
            if (y < 0 || y > height) spermatozoon.vy *= -1;

            // Swim!
            for (var j = 0; ++j < m;) {
                var vx = x - path[j][0],
                    vy = y - path[j][1],
                    k2 = Math.sin(((spermatozoon.count += count) + j * 3) / 300) / speed;
                path[j][0] = (x += dx / speed * k1) - dy * k2;
                path[j][1] = (y += dy / speed * k1) + dx * k2;
                speed = Math.sqrt((dx = vx) * dx + (dy = vy) * dy);
            }
        }
    });

    function headTransform(d) {
      return "translate(" + d.path[0] + ")rotate(" + Math.atan2(d.vy, d.vx) * degrees + ")";
    }

    function tailPath(d) {
      return "M" + d.join("L");
    }
}

function init(){
    svg = d3.select("#spermatozoa_graph").append("svg")
        .attr("width", width)
        .attr("height", height);

    g = svg.selectAll("g")
        .data(spermatozoa)
        .enter().append("g");
}

$("#add-szoid").click(function() {
    spermatozoa.push(addSzoid());
    updateScreen();
});

$("#kill-random-szoid").click(function() {
    if (spermatozoa.length > 1) spermatozoa.pop();
    else showMessage('Do not kill yourself bro!');
    updateScreen();
});

$("#refresh-szoid").click(function() {
    spermatozoa.splice(1, spermatozoa.length)
    updateScreen();
    showMessage('Boom! Refreshing all!');
});

$(document).ready(function() {
    init();
    spermatozoa.push(addSzoid());
    draw();
});