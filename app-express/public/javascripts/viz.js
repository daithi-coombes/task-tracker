/**
 * Viz page javascript class.
 * @license MIT
 * @author daithi coombes <webeire@gmail.com>
 */


/**
 * main()
 */
$(document).ready(function loadViz(){

  var viz = new Viz({
    projects: projects
  });

  //get project hours for this week
  viz.projectGetWeekHours()

})


/**
 * @constructor
 */
var Viz = function Viz(data){

  this.projects = data.projects
}

Viz.prototype.projectGetWeekHours = function vizProjectGetWeekHours(){

  //query api
  $.get(
    '/api/project/hours/week',
    function(json){

      
      console.log(json)
    },
    'json'
  )
}

/**
 * load sample data.
 * @param  {event} e The event
 * @return {Viz|Error}   Returns self for chaining, else Error.
 */
Viz.prototype.manicTimeloadData = function vizManicTimeLoadData(e){
  e.preventDefault();

  var err = null,
    self = this;

  self.sampleSize = $('input[name="sampleSize"]').val() || 100;

  //grab data from endpoint
  self.getData(err, function vizManicTimeGetDataCB(err, data){
    if(err)
      throw new Error(err);

    self.data = data;

    self.drawChart()
      .drawHarness();
  })

  return err | self;
}

/**
 * Get json sample data from endpoint.
 * @param  {Error}   err Error.
 * @param  {Function} cb  callback.
 * @return {Viz}       returns self for chaning.
 */
Viz.prototype.manicTimeGetData = function vizManicTimeGetData(err, cb){
  if(err)
    throw new Error(err);

    console.log(this);
    d3.json("/manicTime/getSample?sample="+this.sampleSize, function(error, data) {
      cb(error, data);
    });

  return err || self;
}


Viz.prototype.manicTimeDrawHarness = function vizManicTimeDrawHarness(err){
  if(err)
    throw new Error(err);

  console.log(this.data);

  return err || this;
}

/**
 * draw line chart of duration over time.
 * LineChart
 * @param  {error} err The error.
 */
Viz.prototype.manicTimeDrawChart = function vizManicTimeDrawChart(err){
  if(err)
    throw new err;

  if(this.data==null)
    throw new Error('Sample data {this.data} is empty!');

  // Set the dimensions of the canvas / graph
  var margin = {top: 30, right: 20, bottom: 50, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

  // Set the ranges
  var x = d3.time.scale().range([0, width]),
    y = d3.scale.linear().range([height, 0]);

  // Define the axes
  var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(d3.time.minutes, 5);
  var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

  var valueline = d3.svg.line()
    .x(function(d){ return x(d.start); })
    .y(function(d){ return y(d.duration); });


  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong>Frequency:</strong> <span style='color:red'>frequency_here</span>";
    })

  var svg = d3.select("#durationDateTime")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  svg.call(tip);

  this.data.forEach(function(d) {
    d.start = d3.time.format("%Y-%m-%d %H:%M:%S").parse(d.start);
    d.duration = +d.duration;
  });

  // Scale the range of the data
  x.domain(d3.extent(this.data, function(d) { return d.start; }));
  y.domain([0, d3.max(this.data, function(d) { return d.duration; })]);

  // Add the valueline path.
  svg.append("path")
    .attr("class", "line")
    .attr("d", valueline(this.data))
    .on('mouseover', function(){
      console.log(arguments);
    })

  // Add the X Axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  // Add the Y Axis
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  return err || this;
}
