(function() {
  var _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  DatsyApp.FilterDataSetsView = (function(_super) {
    __extends(FilterDataSetsView, _super);

    function FilterDataSetsView() {
      this.updatePage = __bind(this.updatePage, this);
      this.setUpTags = __bind(this.setUpTags, this);
      this.renderLoaded = __bind(this.renderLoaded, this);
      _ref = FilterDataSetsView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FilterDataSetsView.prototype.events = {
      'focus #filterTagSearch': 'setUpTags',
      'click #addFilters': 'addFilters',
      'click #seeDataBases': 'loadExploreView'
    };

    FilterDataSetsView.prototype.initialize = function(options) {
      var _this = this;
      this.datsyModel = options.datsyModel;
      this.tags = this.datsyModel.get('tags');
      this.template = this.datsyModel.get('templates')['filterDatasets'];
      this.loadingTemplate = this.datsyModel.get('templates')['loading'];
      if (options.searchTopic.length) {
        this.currentTags = this.buildTags(options.searchTopic);
        this.filterTags();
        this.mainTag = this.uppercase(this.currentTags);
        this.tags.on('loaded', function() {
          return setTimeout((function() {
            return _this.renderLoaded();
          }), 1000);
        });
      } else {
        this.mainTag = 'All databases';
        setTimeout((function() {
          return _this.renderLoaded();
        }), 1000);
      }
      return this;
    };

    FilterDataSetsView.prototype.render = function() {
      this.$el.html(this.loadingTemplate({
        searchTag: this.mainTag
      }));
      return this;
    };

    FilterDataSetsView.prototype.renderLoaded = function() {
      var singular;
      singular = this.tags.totalDataBases === 1;
      this.$el.html(this.template({
        searchTag: this.mainTag,
        occurance: this.tags.totalDataBases,
        singular: singular
      }));
      return this;
    };

    FilterDataSetsView.prototype.uppercase = function(tags) {
      var array,
        _this = this;
      array = tags.map(function(tag) {
        var tagArr;
        tagArr = tag.split(' ').map(function(word) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        });
        return tagArr.join(' ');
      });
      if (array.length === 1) {
        return array[0];
      }
      return array.join(' & ');
    };

    FilterDataSetsView.prototype.setUpTags = function() {
      var tagArray;
      tagArray = this.tags.list();
      return $('#filterTagSearch').autocomplete({
        minLength: 1,
        source: tagArray
      });
    };

    FilterDataSetsView.prototype.filterTags = function() {
      return this.tags.filter(this.currentTags);
    };

    FilterDataSetsView.prototype.addFilters = function() {
      var newTag, tagArray;
      newTag = $('#filterTagSearch').val();
      if (newTag === '') {
        return false;
      }
      tagArray = this.tags.list();
      if (tagArray.indexOf(newTag) === -1) {
        return false;
      }
      this.currentTags.push(newTag);
      this.filterTags();
      return this.updatePage();
    };

    FilterDataSetsView.prototype.updatePage = function() {
      var url,
        _this = this;
      this.mainTag = this.uppercase(this.currentTags);
      this.$el.html("");
      this.render();
      url = '/filterDatasets';
      this.currentTags.forEach(function(tag) {
        return url += '/' + tag;
      });
      Backbone.history.navigate(url, {
        trigger: false
      });
      return setTimeout((function() {
        return _this.renderLoaded();
      }), 1000);
    };

    FilterDataSetsView.prototype.loadExploreView = function() {
      var url,
        _this = this;
      url = '/explore';
      this.currentTags.forEach(function(tag) {
        return url += '/' + tag;
      });
      return Backbone.history.navigate(url, {
        trigger: true
      });
    };

    FilterDataSetsView.prototype.buildTags = function(tags) {
      var _this = this;
      tags = tags.split('/');
      return tags.map(function(tag) {
        return tag.split('_').join(' ');
      });
    };

    return FilterDataSetsView;

  })(Backbone.View);

}).call(this);
