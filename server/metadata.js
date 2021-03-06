var fs = require('fs');

var metadata = {
  dataSetTags: [],
  totalDataSets: 0,
  dataSets: []
};

exports.setUpMetaData = function() {
  // build out dataset tags
  readFakeJSON(function(data) {
    data.tags.forEach(function(datum) {
      metadata.dataSetTags.push(datum);
    });
  },
  function(data) {
    data.datasets.forEach(function(dataset) {
      metadata.totalDataSets++;
      metadata.dataSets.push(dataset);
    });
  });
};

exports.getColumnData = function(databaseID, columnName, cb) {
  readDataBaseColumn(databaseID, columnName, function(data) {
    cb(data);
  });
};

exports.getAllMetaData = function() {
  return metadata.dataSets;
};

exports.getMetaData = function(tag) {
  var results = metadata.dataSets.filter(function(dataset) {
    return (dataset.tags.indexOf(tag) === -1) ? false : true;
  });
  return results;
};

exports.getTags = function() {
  return { tags: metadata.dataSetTags, total: metadata.totalDataSets };
};

exports.getFilteredTags = function(query) {
  return { tags: metadata.dataSetTags, total: 1 };
};

exports.getSampleData = function(id, columnName) {
  var column =  metadata.dataSets[id].columns.filter(function(column) {
    return columnName === column.name;
  });
  return column[0].data_sample;
};

var readFakeJSON = function(cb1, cb2) {
  
  fs.readFile('./server/fakedata/tags.json', 'binary', function(err, data) {
    cb1(JSON.parse(data));
  });

  fs.readFile('./server/fakedata/datasets-meta.json', 'binary', function(err, data) {
    cb2(JSON.parse(data));
  });
};

var readDataBaseColumn = function(id, columnName, cb) {
  var filename = './server/fakedata/' + id + '-dataset-full.json';
  fs.readFile(filename, 'binary', function(err, data) {
    data = JSON.parse(data);
    data.columns.forEach(function(column) {
      if (column.name === columnName) {
        cb(column.data);
      }
    });
  });
};

