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
var SvgBarChart = function(args) {
    this.svg = document.getElementById(args.id);
    this.viewBox = this.svg.viewBox;
    this.width = this.viewBox.baseVal.width;
    this.height = this.viewBox.baseVal.height;
    this.xOffset = this.width * 0.05;
    this.maxWidth = this.width - (this.xOffset * 2);
    this.yOffset = this.height * 0.05;
    this.maxHeight = this.height - (this.yOffset * 2);
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

    function svgBarPath(x, y, width, height) {
        var bar = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        bar.setAttribute("x", x);
        bar.setAttribute("y", y);
        bar.setAttribute("width", width);
        bar.setAttribute("height", height);
        bar.setAttribute("stroke", "black");
        bar.setAttribute("fill", randomColor());
        return bar;
    } // svgBarPath()

    /**
    Returns a chart label in the form of a DOM node to be appended to an SVG element.
    x   := x
    y   := y
    text := text of the label
    */
    function svgBarLabel(x, y, width, height, text) {
        var label = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        label.innerHTML = text;
        label.setAttribute("alignment-baseline", "middle");
        label.setAttribute("x", x);
        label.setAttribute("y", y + (height / 2));
        label.setAttribute("stroke", "black");
        label.setAttribute("fill", "black");
        return label;
    } // svgBarLabel()

    // Find max value
    this.maxValue = 0;
    for (var i = 0; i < this.data.length; i++) {
        if (this.data[i].value > this.maxValue) {
            this.maxValue = this.data[i].value;
        } // if
    } // for i

    for (var i = 0; i < this.data.length; i++) {
        var barHeight = this.maxHeight / this.data.length;
        var x = this.xOffset;
        var y = this.yOffset + (i * barHeight);
        var width = (this.data[i].value / this.maxValue) * this.maxWidth;
        var height = barHeight;

        var bar = svgBarPath(x, y, width, height);
        this.svg.appendChild(bar);
        var label = svgBarLabel(x + (this.maxWidth * 0.01), y, width, height,
            this.data[i].label + " (" + this.data[i].value + ")");
        this.svg.appendChild(label);
    } // for i

} // class SvgBarChart
