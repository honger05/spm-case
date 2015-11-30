
/**
 *  过滤状态保持类
 */

var Backbone = require('backbone');

var filterState = new Backbone.Model({
  filter: 'all'
})

var filterChannel = Backbone.Radio.channel('filter');

filterChannel.reply('filterState', function() {
  return filterState;
})
