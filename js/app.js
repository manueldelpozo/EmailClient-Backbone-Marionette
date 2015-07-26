//MODEL
var Mail = Backbone.Model.extend();
// Collection of mail for the list
var Mails = Backbone.Collection.extend({
  model: Mail
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
