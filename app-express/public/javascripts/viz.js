/**
 * Viz page javascript class.
 * @license MIT
 * @author daithi coombes <webeire@gmail.com>
 */


/**
 * main()
 */
$(document).ready(function loadViz(){

  $('a#vizLoadData').on('click', viz.durationDateTime);
})


/**
 * @constructor
 */
var viz = (function Viz(){

  var self = {};

  /**
   * draw line chart of duration over time.
   * @param  {event} e The event.
   */
  self.durationDateTime = function(e){
    e.preventDefault();

    var sampleSize = $('input[name="sampleSize"]').val() || 10;

    // Set the dimensions of the canvas / graph
    var margin = {top: 30, right: 20, bottom: 50, left: 50},
      width = 1000 - margin.left - margin.right,
      height = 270 - margin.top - margin.bottom;

    // Set the ranges
    var x = d3.time.scale().range([0, width]),
      y = d3.scale.linear().range([height, 0]);

    // Define the line
    var valueline = d3.svg.line()
      .x(function(d) { return x(d.start); })
      .y(function(d) { return y(d.duration); });

    // Define the axes
    var xAxis = d3.svg.axis().scale(x)
      .orient("bottom").ticks(d3.time.minutes, 5);

    var yAxis = d3.svg.axis().scale(y)
      .orient("left").ticks(5);

    //get sample
    d3.json("/manicTime/getSample?sample="+sampleSize, function(error, data) {

      if(error)
        throw new error

      //if chart exists, update data & return
      if($('#durationDateTime svg').attr('width')){

        // Scale the range of the data again
      	x.domain(d3.extent(data, function(d) { return d.start; }));
  	    y.domain([0, d3.max(data, function(d) { return d.duration; })]);

        // Select the section we want to apply our changes to
        var svg = d3.select("#durationDateTime").transition();

        // Make the changes
        svg.select(".line")   // change the line
          .duration(750)
          .attr("d", valueline(data));
        svg.select(".x.axis") // change the x axis
          .duration(750)
          .call(xAxis);
        svg.select(".y.axis") // change the y axis
          .duration(750)
          .call(yAxis);

        return;
      }

      //else draw chart
      else{
        var svg = d3.select("#durationDateTime")
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");
      }

      data.forEach(function(d) {
        d.start = d3.time.format("%Y-%m-%d %H:%M:%S").parse(d.start);
        d.duration = +d.duration;
      });

      // Scale the range of the data
      x.domain(d3.extent(data, function(d) { return d.start; }));
      y.domain([0, d3.max(data, function(d) { return d.duration; })]);

      // Add the valueline path.
      svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

      // Add the X Axis
      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      // Add the Y Axis
      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    })
  }

  return self;
})();
