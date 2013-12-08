(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  DatsyApp.ChartView = (function(_super) {
    var bubbleSort;

    __extends(ChartView, _super);

    function ChartView() {
      _ref = ChartView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ChartView.prototype.events = {};

    ChartView.prototype.tagName = "svg";

    ChartView.prototype.initialize = function(options) {
      this.currentXModel = null;
      this.currentYModel = null;
      this.chartWidth = $(".container").width();
      this.chartHeight = this.chartWidth / 2;
      this.rawData = {
        x: [],
        yValues: {}
      };
      this.convertData(options);
      this.margin = {
        top: 20,
        right: 140,
        bottom: 30,
        left: 20
      };
      this.padding = 50;
      this.width = this.chartWidth - this.margin.left - this.margin.right;
      this.height = this.chartHeight - this.margin.top - this.margin.bottom;
      return this.graphs = new DatsyApp.Charts();
    };

    ChartView.prototype.render = function() {
      var chartType;
      d3.select(this.el).selectAll("*").remove();
      chartType = this.model.get("chartType");
      if (chartType === "lineChart") {
        this.graphs.renderLineChart(this.data);
      } else if (chartType === "lineChart2Y") {
        this.graphs.renderLineChart2Y(this.data);
      } else if (chartType === "stackedArea") {
        this.graphs.renderStackedAreaChart(this.data);
      } else if (chartType === "stackedMultiBar") {
        this.graphs.renderStackedMultiBar(this.data);
      } else {
        if (chartType === "scatterBubble") {
          this.graphs.renderScatterBubbleGraph(this.data);
        }
      }
      return this.$el;
    };

    ChartView.prototype.renderChart = function() {
      return this.trigger("renderChart", {
        chartView: true,
        x: this.currentXModel,
        y: this.currentYModel
      });
    };

    ChartView.prototype.convertData = function(options) {
      var _this = this;
      this.rawData.x = options.data.columnsForX[0].getColumnData();
      options.data.columnsForY.forEach(function(column) {
        return _this.rawData.yValues[column.columnName] = column.getColumnData();
      });
      return this.data = this.convertJSONForD3(this.rawData);
    };

    ChartView.prototype.convertJSONForD3 = function(data) {
      var colors, d3Data, i, key;
      d3Data = [];
      colors = ["red", "blue", "green", "black", "magenta", "cyan"];
      i = 0;
      for (key in data.yValues) {
        d3Data.push({
          key: key,
          values: [],
          color: colors[i]
        });
        i++;
      }
      i = 0;
      while (i < data.x.length) {
        d3Data.forEach(function(item) {
          return item.values.push({
            x: new Date(data.x[i]).getTime(),
            y: +data.yValues[item.key][i]
          });
        });
        i++;
      }
      i = 0;
      while (i < d3Data.length) {
        d3Data[i].values["x"] = bubbleSort(d3Data[i].values["x"]);
        i++;
      }
      console.log(d3Data);
      this.bubbleSort(d3Data);
      return d3Data;
    };

    bubbleSort = function(object) {
      var recurse, series;
      recurse = function(array) {
        var i, j, notYetSorted, thisVal, thisY;
        if (!Array.isArray(array)) {
          throw array;
        }
        notYetSorted = true;
        i = 0;
        while (notYetSorted) {
          notYetSorted = false;
          j = 0;
          while (j < array.length - 1) {
            thisVal = array[j];
            thisY = object[series].values.y[j];
            if (thisVal > array[j + 1]) {
              array[j] = array[j + 1];
              array[j + 1] = thisVal;
              object[series].values.y[j] = object[series].values.y[j + 1];
              object[series].values.y[j + 1] = thisY;
              notYetSorted = true;
            }
            j++;
          }
          if (notYetSorted === false) {
            return array;
          }
          i++;
        }
        return array;
      };
      series = 0;
      while (series < object.length) {
        recurse(object[series].values.x);
        series++;
      }
      return object;
    };

    return ChartView;

  })(DatsyApp.SvgBackboneView);

}).call(this);
