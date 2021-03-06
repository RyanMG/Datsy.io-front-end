class DatsyApp.FilterDataSetsView extends Backbone.View
  
  className: 'container filter-page',

  events:
    'focus #filterTagSearch': 'setUpTags',
    'click .input-group-btn': 'addFilters',
    'click .tag-suggestion': 'addSuggestedFilter',
    'click #seeDataBases': 'loadExploreView',
    'click #seeAllDataBases': 'loadAllExploreView'
    'click .glyphicon-remove-sign': 'removeTopic'

  initialize: (options) ->
    @datsyModel = options.datsyModel
    @tags = @datsyModel.get('tags')
    @template =  @datsyModel.get('templates')['filterDatasets']
    @loadingTemplate = @datsyModel.get('templates')['loading']
    @noResultsTemplate = @datsyModel.get('templates')['noResultsTemplate']
    if (options.searchTopic.length)
      @currentTags = @buildTags options.searchTopic
      @filterTags()
      @mainTag = @uppercase @currentTags
      @tags.on 'loaded', =>
        setTimeout (=> @renderLoaded()), 1000
    else
      @currentTags = []
      @mainTag = 'All databases'
      setTimeout (=> @renderLoaded()), 1000
    @

  render: ->
    @$el.html @loadingTemplate({ searchTag: @mainTag })
    @

  renderLoaded: =>
    if @tags.totalDataBases
      maintags = @mainTag.split(' & ')
      if maintags[0] == ""
        tagsToShow = false
      else
        tagsToShow = true
      tags = @tags.list()    
      singular = @tags.totalDataBases == 1
      @$el.html @template({ tagsToShow: tagsToShow, tags: maintags, occurance: @tags.totalDataBases, singular: singular })
    else
      @$el.html @noResultsTemplate({ tagsToShow: tagsToShow, tags: maintags, singular: singular })

    suggestedTags = @getRandomTags()
    suggested = new DatsyApp.SuggestedTagsView { model: @datsyModel, tags: suggestedTags }
    suggested.on 'addTag', @newSearchForTag
    @$el.append suggested.render().el
    @

  getRandomTags: ->
    return @tags.random(10)

  uppercase: (tags) ->
    array = tags.map (tag) =>
      tagArr = tag.split(' ').map (word) ->
        return word.charAt(0).toUpperCase() + word.slice(1)
      return tagArr.join(' ')
    return array[0] if array.length == 1
    return array.join(' & ')

  setUpTags: =>
    tagArray = @tags.list()
    $('#filterTagSearch').autocomplete { minLength: 1, source: tagArray }

  filterTags: ->
    @tags.filter @currentTags

  removeTopic: ->
    tag = event.target.parentElement.innerText.toLowerCase()
    index = @currentTags.indexOf(tag)
    @currentTags.splice index, index+1
    @filterTags()
    @updatePage()

  addFilters: ->
    newTag = $('#filterTagSearch').val()
    if newTag == ''
      @noteError 'Please enter a keyword to search'
      return false
    tagArray = @tags.list()
    if (tagArray.indexOf(newTag) == -1)
      @noteError 'This keyword has no matches to your current search'
      return false
    @currentTags.push newTag
    @filterTags()
    @updatePage()

  newSearchForTag: (tag) =>
    @currentTags = @buildTags tag
    @filterTags()
    @updatePage()

  updatePage: =>
    @mainTag = @uppercase @currentTags
    @$el.html ""
    @render()
    url = '/filterDatasets'
    @currentTags.forEach (tag) =>
      url += '/' + tag
    Backbone.history.navigate url, {trigger: false}
    setTimeout (=> @renderLoaded()), 1000

  loadExploreView: ->
    @datsyModel.clearCart()
    url = '/explore'
    if @currentTags.length
      @currentTags.forEach (tag) =>
        if tag.split(' ').length > 1
          tag = tag.split(' ').join('_')
        url += '/' + tag
    Backbone.history.navigate url, {trigger: true}

  loadAllExploreView: ->
    @datsyModel.clearCart()
    Backbone.history.navigate '/explore', {trigger: true}

  buildTags: (tags) ->
    tags = tags.split('/')
    return tags.map (tag) =>
      return tag.split('_').join(' ')

  noteError: (error) ->
    if ($('#filterTagSearch').val() != '')
      $('#filterTagSearch').val('')
    $('#filterTagSearch').attr("placeholder", error)
