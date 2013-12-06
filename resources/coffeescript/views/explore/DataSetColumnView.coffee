class DatsyApp.DataSetColumnView extends Backbone.View

  tagName: 'li',

  className: 'column-listing row',

  events:
    'click .viewSampleData': 'viewSampleData',
    'click .addColumnForVis': 'addColumnForVis'

  initialize: (options) ->
    @template = options.template
    @datasetName = options.datasetName
    @datsyModel = options.datsyModel

  render: ->
    @$el.html @template(@model)
    @

  viewSampleData: ->
    @sampleDataModelView = new DatsyApp.DataSampleModelView { datasetName: @datasetName, columnName: @model.name }
    @sampleDataModelView.once 'ready', @showModal
    @sampleDataModelView.once 'done', @deleteModalView

  addColumnForVis: ->
    @datsyModel.addColumn @model.name, @datasetName

  showModal: =>
    @sampleDataModelView.show()

  deleteModalView: =>
    delete @sampleDataModelView
