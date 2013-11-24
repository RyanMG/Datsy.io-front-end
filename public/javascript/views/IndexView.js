DatsyApp.IndexView = Backbone.View.extend({

  className: '',
  
  events: {
    'click button#explore-data': 'navigateExploreData',
    'click button#visualize-data': 'navigateVisualizeData'
  },

  initialize: function() {
    this.template = this.model.get('templates')['index'];
  },

  render: function() {
    this.$el.html( this.template(this.model.attributes) );
    return this;
  },

  navigateVisualizeData: function() {
    // Navigate to VisualizeData view
    console.log('navigateVisualizeData');
  },

  navigateExploreData: function() {
    // Navigate to ExploreData view
    console.log('navigateExploreData');
  }

});