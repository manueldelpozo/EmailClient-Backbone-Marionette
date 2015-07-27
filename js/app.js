// Format Date functions
function formatDate(date) {
  var monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"]; 
  var formatDate = new Date( date*1000 );
  return monthNames[formatDate.getMonth()] +" "+ formatDate.getDate() +", "+ formatDate.getFullYear();
}
function diffDate(date) {
  var currentDateUnix = new Date();
  var formatDate = new Date( date*1000 );
  var diffMonths = currentDateUnix.getMonth() - formatDate.getMonth();
  var diffDates = currentDateUnix.getDate() - formatDate.getDate();
  var diffHours = currentDateUnix.getHours() - formatDate.getHours();
  var diffMinutes = currentDateUnix.getMinutes() - formatDate.getMinutes();
  var timeAgo = "";
  if( diffMonths > 0 )
    timeAgo += diffMonths + " months and " + diffDates + " days";
  else {
    if( diffDates > 0 )
      timeAgo += diffDates + " days";
    else {
      if( diffHours > 0 )
        timeAgo += diffHours + " hours";
      else {
        if( diffMinutes > 0 )
          timeAgo += diffMinutes + " mins";
        else
          timeAgo += "few seconds";
      }
    }
  }
  timeAgo += " ago";
  return timeAgo;
}

//MODEL
var Mail = Backbone.Model.extend();
// Collection of mail for the list
var Mails = Backbone.Collection.extend({
  model: Mail,
  url: "./email.json",
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
  template: '#mailView',
  initialize: function() {
    // Set class read 
    if( this.model.get('read') )
      $(this.el).removeClass( "unread" ).addClass( "read" );
    // Set a new attribute for the difference of date
    this.model.set('timeAgo', diffDate(this.model.get('dateReceived')) );
  },
  events: {
    "click": "showMail"
  },
  showMail: function(e) {   
    var selected = this;
    // Switch class if the mail is unread
    var $el = $(selected.el);
    if( $el.hasClass("unread") )
      $el.removeClass( "unread" ).addClass( "read" );
    // Format date in a new attribute
    selected.model.set( 'dateReceivedFormat', formatDate(selected.model.get('dateReceived')) );
    // New view for the content and render
    var emailView = new ContentView({
      model: selected.model,
      className: "selected"
    });
    $("#content").html( emailView.render().el ); 
  }
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

// Filter Unread and Read mails
$('#unread-list').click( function(){
  $('.read').slideUp(400);
});
$('#all-list').click( function(){
  $('.read').slideDown(400);
});