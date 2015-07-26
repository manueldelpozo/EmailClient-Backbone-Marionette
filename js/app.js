//MODEL
var Mail = Backbone.Model.extend();
// Collection of mail for the list
var Mails = Backbone.Collection.extend({
  model: Mail,
  url: "../data/email.json",
  parse: function(response) {
    return response;
  },
  sort_key: 'dateReceived', // default sort key
  comparator: function(item) {
      return -item.get(this.sort_key); // Note the minus for desc order!
  },
  sortByField: function(fieldName) {
      this.sort_key = fieldName;
      this.sort();
  }
});

//VIEWS
// View for mail content
var ContentView = Backbone.Marionette.ItemView.extend({
  template: '#contentView'
});
// View for mail list item
var MailView = Backbone.Marionette.ItemView.extend({
  className: 'unread',
  template: '#mailView'
});
// Collection View 
var MailsView = Backbone.Marionette.CollectionView.extend({
  tagName: 'div',
  childView: MailView
});

// Create new collection of mails
var list = new Mails();
list.fetch({ 
  success: function() {
    console.log("JSON file load was successful", list);
  },
  error: function(){
    console.log('There was some error in loading and processing the JSON file');
  }
});
// Call the sort method
list.sortByField('dateReceived');
// Create new collection of views for list and render
var listView = new MailsView({
  collection: list
});
$("#list").append( listView.render().el );
