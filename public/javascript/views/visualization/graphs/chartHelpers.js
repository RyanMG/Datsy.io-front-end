(function() {
  DatsyApp.ChartHelpers = (function() {
    function ChartHelpers() {}

    ChartHelpers.prototype.sinAndCos = function() {
      var cos, i, sin;
      sin = [];
      cos = [];
      i = 0;
      while (i < 100) {
        sin.push({
          x: i,
          y: Math.sin(i / 10)
        });
        cos.push({
          x: i,
          y: .5 * Math.cos(i / 10)
        });
        i++;
      }
      return [
        {
          values: sin,
          key: "Sine Wave",
          color: "#ff7f0e"
        }, {
          values: cos,
          key: "Cosine Wave",
          color: "#2ca02c"
        }
      ];
    };

    ChartHelpers.prototype.stream_layers = function(n, m, o) {
      var bump;
      bump = function(a) {
        var i, w, x, y, z;
        x = 1 / (.1 + Math.random());
        y = 2 * Math.random() - .5;
        z = 10 / (.1 + Math.random());
        i = 0;
        while (i < m) {
          w = (i / m - y) * z;
          a[i] += x * Math.exp(-w * w);
          i++;
        }
        if (arguments.length < 3) {
          return o = 0;
        }
      };
      return d3.range(n).map(function() {
        var a, i;
        a = [];
        i = void 0;
        i = 0;
        while (i < m) {
          a[i] = o + o * Math.random();
          i++;
        }
        i = 0;
        while (i < 5) {
          bump(a);
          i++;
        }
        return a.map(ChartHelpers.prototype.stream_index);
      });
    };

    ChartHelpers.prototype.stream_waves = function(n, m) {
      return d3.range(n).map(function(i) {
        return d3.range(m).map(function(j) {
          var x;
          x = 20 * j / m - i / 3;
          return 2 * x * Math.exp(-.5 * x);
        }).map(DatsyApp.ChartHelpers.stream_index);
      });
    };

    ChartHelpers.prototype.stream_index = function(d, i) {
      return {
        x: i,
        y: Math.max(0, d)
      };
    };

    ChartHelpers.prototype.findMinMax = function(data) {
      var concatArr, curVal, i, j, max, min, propertiesArray;
      propertiesArray = Array.prototype.slice.call(arguments, 1);
      concatArr = [];
      i = 0;
      while (i < data.length) {
        j = 0;
        while (j < propertiesArray.length) {
          concatArr.push(data[i][propertiesArray[j]]);
          j++;
        }
        i++;
      }
      i = 0;
      while (i < concatArr.length) {
        curVal = concatArr[i];
        if (!min) {
          min = curVal;
        }
        if (!max) {
          max = curVal;
        }
        if (curVal < min) {
          min = curVal;
        }
        if (curVal > max) {
          max = curVal;
        }
        i++;
      }
      return {
        min: min,
        max: max
      };
    };

    ChartHelpers.prototype.randomData = function(groups, points) {
      var data, i, j, random, shapes;
      data = [];
      shapes = ["circle", "cross", "triangle-up", "triangle-down", "diamond", "square"];
      random = d3.random.normal();
      i = 0;
      while (i < groups) {
        data.push({
          key: "Group " + i,
          values: []
        });
        j = 0;
        while (j < points) {
          data[i].values.push({
            x: random(),
            y: random(),
            size: Math.random()
          });
          j++;
        }
        i++;
      }
      return data;
    };

    return ChartHelpers;

  })();

}).call(this);
