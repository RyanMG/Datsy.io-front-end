DatsyApp.GraphView = DatsyApp.SvgBackboneView.extend({

  tagName: 'svg',

  events: {},

  initialize: function(options) {
    this.dataX = options.dataX;
    this.dataY = options.dataY;
    this.width = options.width;
    this.setGraphVariables();
    this.margin = { top: 20, right: 30, bottom: 30, left: 40 };
  },

  render: function() {
    this.drawChart();
    return this.$el;
  },

  setGraphVariables: function() {
    var self = this;
    setTimeout(function() {
      var chart = self.$el;
      var h = self.width / 2;
      chart.css({ 'height': h, 'width': self.width });
      self.height = chart.height() - self.margin.top - self.margin.bottom;
    }, 1);
  },

  drawChart: function() {
    this.$el.empty();
    var self = this;
    var chartData = this.data.map(function(d) {
      return { value: d.get('frequency'), letter: d.get('letter') };
    });

    var y = d3.scale.linear()
        .domain([0, d3.max(chartData, function(d) { return d.value; }) ])
        .range([this.height, 0]);

    var x = d3.scale.ordinal()
        .domain(chartData.map( function(d) { return d.letter; }))
        .rangeRoundBands([0, this.width], .1); // maps letters to the width, with a division between each
   
    var xAxis = d3.svg.axis()
        .scale(x).orient('bottom');

    var yAxis = d3.svg.axis()
        .scale(y).orient('left')
        .ticks(10, '%');

    var chart = d3.select('svg')
        .attr('width', this.width + this.margin.left + this.margin.right)
        .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
    
    chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + this.height + ')')
        .call(xAxis);

    chart.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
      .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('Frequency');

    chart.selectAll('.bar')
        .data(chartData)
      .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function(d) { return x(d.letter); })
        .attr('y', function(d) { return y(d.value); })
        .attr("height", function(d) { return self.height - y(d.value); })
        .attr("width", x.rangeBand());
  }


});