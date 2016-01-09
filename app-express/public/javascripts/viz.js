/**
 * Viz page javascript class.
 * @license MIT
 * @author daithi coombes <webeire@gmail.com>
 */


/**
 * main()
 */
$(document).ready(function loadViz(){

  var viz = new Viz();

  //get project hours for this week

})


/**
 * @constructor
 */
var Viz = function Viz(data){

  var self = this;

  self.projectGetWeekHours(null, self.projectWeekBarChar);

  return self;
}

/**
 * Draw bar chart of project hours.
 * @param  {Error} err  Error obj if any.
 * @param  {json} data Data as array of objects.
 */
Viz.prototype.projectWeekBarChar = function vizProjectWeekBarChar(err, data){

  //get column data for bar chart
  var column_data = [];
  data.forEach(function(doc, i){
    column_data.push({
      position: i,
      title: doc.project.title,
      color: doc.project.color,
      minutes: doc.minutes
    });
  });

  var total_width = 400;
  var total_height = 250;
  var legend_height = 20;
  var bar_padding = 5;

  var scale_y = d3.scale.linear()
    .domain([0, d3.max(column_data, function(d){
        return d.minutes;
      })])
    .range([0, total_height])

  var scale_x = d3.scale.ordinal()
    .domain(d3.range(column_data.length))
    .rangeRoundBands([0, total_width], 0.05);

  var position = function(d){
    return d.position;
  }

  var svg_container = d3.select("#currentWeek")
    .append("svg")
    .attr("width", total_width)
    .attr("height", total_height);

  svg_container.selectAll("rect")
    .data(column_data, position)
    .enter()
    .append("rect")
    .attr("x", function(d, i){
      return scale_x(i);
    })
    .attr("y", function(d){
      return (total_height) - scale_y(d.minutes);
    })
    .attr("width", total_width / column_data.length - bar_padding)
    .attr("height", function(d){
      return scale_y(d.minutes)-legend_height;
    })
    .attr("fill", function(d, i){
      return d.color;
    })
    .attr("opacity", "0.5");

  svg_container.selectAll("text.count")
    .data(column_data)
    .enter()
    .append("text")
    .attr("class","count")
    .text(function(d){
      var hrs = Math.floor(d.minutes/60)
        ,minutes = d.minutes % 60;
      return hrs+" hrs "+ ((minutes>0) ? minutes+" mins" : "");
    })
    .attr("x", function(d, i){
      return i * (total_width / column_data.length) + (total_width / column_data.length - bar_padding) / 2;
    })
    .attr("y", function(d){
      var y = (total_height) - scale_y(d.minutes) + 15;
      return (y<220) ? y : 220;
    })
    .attr("text-anchor", "middle")

  svg_container.selectAll("text.label")
    .data(column_data)
    .enter()
    .append("text")
    .attr("class", "count")
    .text(function(d){
      return d.title;
    })
    .attr("x", function(d, i){
      return i * (total_width / column_data.length) + (total_width / column_data.length - bar_padding) / 2;
    })
    .attr("y", 250)
    .attr("text-anchor", "middle");
}


/**
 * Get Project Hours & Tasks for current week.
 * @return {array} An array of project data.
 */
Viz.prototype.projectGetWeekHours = function vizProjectGetWeekHours(err, cb){

  var cb,
    self = this;

  //query api
  $.get(
    '/api/project/hours/week',
    function(json){

      var _cb = cb

      json.res.forEach(function(project, i){

        var minutes = 0

        //get total minutes
        project.tasks.forEach(function(task, x){
          minutes += task.duration
          //console.log(json.res[i].project.title+':'+minutes+' ('+task.duration+')'+task.id)
        })

        json.res[i].minutes = minutes
      })

      self.data = json.res;

      _cb(null, json.res)
    },
    'json'
  )

  /**
   * Get each projects total minutes over task.
   * @param  {array} res An array of Project objects.
   * @private
   * @return {array}     The same data with total minutes added.
   */
  function getProjectsMinutes(res){

  }
}
// end getProjectsMinutes()


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


/**
 * @todo document this.
 */
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
