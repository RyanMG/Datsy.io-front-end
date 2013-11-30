(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  DatsyApp.ListDataSetsView = (function(_super) {
    __extends(ListDataSetsView, _super);

    function ListDataSetsView() {
      _ref = ListDataSetsView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ListDataSetsView.prototype.initialize = function(options) {
      this.template = options.template;
      this.itemViewTemplate = options.dataSetItemTemplate;
      return this.databases = options.databases;
    };

    ListDataSetsView.prototype.render = function() {
      var listing,
        _this = this;
      this.$el.html(this.template);
      listing = this.databases.map(function(database) {
        return new DatsyApp.DataSetItemView({
          template: _this.itemViewTemplate,
          model: database
        });
      });
      this.$el.find('.accordion').append(this.databases.map(function(database) {
        return new DatsyApp.DataSetItemView({
          template: _this.itemViewTemplate,
          model: database
        }).render();
      }));
      return this;
    };

    return ListDataSetsView;

  })(Backbone.View);

}).call(this);
