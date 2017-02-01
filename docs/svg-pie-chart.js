/*
Copyright (c)2017 Thomas Phillips.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/**
args:
    id   := id of SVG element
    data := [ {label: <label>, percent: <percent>, color: <color>} ... ]
        Required fields: label, percent
        Optional fields: color
*/
var SvgPieChart = function(args) {
    this.svg = document.getElementById(args.id);
    this.viewBox = this.svg.viewBox;
    this.cx = this.viewBox.baseVal.width / 2;
    this.cy = this.viewBox.baseVal.height / 2;
    this.r = (this.cx < this.cy) ? this.cx : this.cy;
    this.arcR = 0.8;
    this.labelR = 0.9;
    this.data = args.data;

    // Fallback to random data.
    if (typeof this.data === "undefined") {
        this.data = [
            {label: "Hydroelectric", percent: .177, color: "black"},
            {label: "Biomass", percent: .393, color: "black"},
            {label: "Wind", percent: .369, color: "black"},
            {label: "solar", percent: .061, color: "black"}
        ];
    } // if

    // Derived from http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript#1484514
    function randomColor() {
        var letters = '0123456789ABCDEF';
        var letters = '89ABCDEF89ABCDEF'; // pastels
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    } // randomColor

    /**
    Polar to cartesian coordinates.
    r      := radius
    theta  := theta (counterclockwise rotation)
    Returns a point structure, {x:<value>, y:<value>}

    NOTE: y down is positive, y up is negative, for happy computer graphics

    0 degrees is directly to the right.
    90 degrees is straight up.
    */
    function p2c(r, theta) {
        return {
            x: r * Math.cos(theta),
            y: -1 * r * Math.sin(theta)
        };
    } // p2c

    /**
    Returns a pie chart wedge in the form of a DOM node to be appended to an SVG element.
    cx := center x
    cy := center y
    r  := radius
    t1 := start theta (in degrees)
    t2 := end theta (in degrees)

    0 degrees is directly to the right.
    90 degrees is straight up.
    */
    function svgArcPath(cx, cy, r, t1, t2) {
        var p;
        var path = "";
        var arc = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        path += "M " + cx + " " + cy + " ";
        p = p2c(r, t1);
        path += "L " + (cx + p.x) + " " + (cy + p.y) + " ";
        p = p2c(r, t2);
        path += "A " + r + " " + r + " 0 0 0 " + (cx + p.x) + " " + (cy + p.y);
        path += "L " + cx + " " + cy + " ";
        arc.setAttribute("d", path);
        arc.setAttribute("stroke", "black");
        arc.setAttribute("fill", randomColor());
        return arc;
    } // svgArcPath()

    /**
    Returns a pie chart label in the form of a DOM node to be appended to an SVG element.
    cx   := center x
    cy   := center y
    r    := radius
    t1   := start theta (in degrees)
    t2   := end theta (in degrees)
    text := text of the label

    0 degrees is directly to the right.
    90 degrees is straight up.
    */
    function svgArcLabel(cx, cy, r, t1, t2, text) {
        var p;
        p = p2c(r, (t1 + t2) / 2);
        var label = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        label.innerHTML = text;
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("x", cx + p.x);
        label.setAttribute("y", cy + p.y);
        label.setAttribute("stroke", "black");
        label.setAttribute("fill", "black");
        return label;
    } // svgArcLabel()

    var t1 = 0;
    var t2 = 0;
    for (var i = 0; i < this.data.length; i++) {
        t2 = t1 + (360 * this.data[i].percent);
        var arc = svgArcPath(
            this.cx, this.cy,
            this.r * this.arcR,
            t1 * (Math.PI/180),
            t2 * (Math.PI/180)
        );
        this.svg.appendChild(arc);
        var label1 = svgArcLabel(
            this.cx, this.cy,
            this.r * this.labelR,
            t1 * (Math.PI/180),
            t2 * (Math.PI/180),
            this.data[i].label
        );
        this.svg.appendChild(label1);
        var label2 = svgArcLabel(
            this.cx, this.cy + (label1.getBBox().height),
            this.r * this.labelR,
            t1 * (Math.PI/180),
            t2 * (Math.PI/180),
            "" + (Math.floor(this.data[i].percent * 1000)/10) + "%"
        );
        this.svg.appendChild(label2);
        t1 = t2;
    } // for i

} // class SvgPieChart
