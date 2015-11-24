
import Backbone from 'backbone';
import LocalStorage from '../vendor/backbone.localStorage';
import _ from 'lodash';
import $ from 'jquery';

var {Model, View, Collection, Router} = Backbone;


var ENTER_KEY = 13;
var TodoFilter = '';

class Todo extends Model {

	defaults() {
		return {
			title: '',
			completed: false
		}
	}

	toggle() {
		this.save({
			completed: !this.get('completed')
		})
	}

}

class TodoList extends Collection {

	constructor(options) {
		super(options);

		this.model = Todo;

		this.localStorage = new LocalStorage('todos-traceur-backbone'); 
	}

	completed() {
		return this.filter(todo => todo.get('completed'));
	}

	remaining() {
		return this.without(...this.completed());
	}

	nextOrder() {
		if (!this.length) {
			return 1;
		}

		return this.last().get('order') + 1;
	}

	comparator(todo) {
		return todo.get('order');
	}

}

var Todos = new TodoList();


class TodoView extends View {

	constructor(options) {
		super(options);

		this.tagName = 'li';

		this.template = _.template($('#item-template').html());

		this.input = '';

		this.events = {
			'click .toggle': 'toggleCompleted',
      'dblclick label': 'edit',
      'click .destroy': 'clear',
      'keypress .edit': 'updateOnEnter',
      'blur .edit': 'close'
		};

		this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
    this.listenTo(this.model, 'visible', this.toggleVisible);

    super(options);
	}

	render() {
		this.$el.html(this.template(this.model.toJSON()));
		this.$el.toggleClass('completed', this.model.get('completed'));
		this.toggleVisible();
    this.input = this.$('.edit');
    return this;
	}

	toggleVisible() {
		this.$el.toggleClass('hidden', this.isHidden);
	}

	get isHidden() {
		var isCompleted = this.model.get('completed'); // const
    return (// hidden cases only
      (!isCompleted && TodoFilter === 'completed') ||
      (isCompleted && TodoFilter === 'active')
    );
	}

	toggleCompleted() {
		this.model.toggle();
	}

	edit() {
		var value = this.input.val(); // const

    this.$el.addClass('editing');
    this.input.val(value).focus();
	}

	close() {
		var title = this.input.val(); // const

    if (title) {
      this.model.save({ title });
    } else {
      this.clear();
    }

    this.$el.removeClass('editing');
	}

	updateOnEnter(e) {
		if (e.which === ENTER_KEY) {
			this.close();
		}
	}

	clear() {
		this.model.destroy();
	}

}


export class AppView extends View {

	constructor() {
		super();

		this.setElement($('#todoapp'), true);

		this.statsTemplate = _.template($('#stats-template').html());

		this.events = {
      'keypress #new-todo': 'createOnEnter',
      'click #clear-completed': 'clearCompleted',
      'click #toggle-all': 'toggleAllComplete'
    };

    this.allCheckbox = this.$('#toggle-all')[0];
    this.$input = this.$('#new-todo');
    this.$footer = this.$('#footer');
    this.$main = this.$('#main');

    this.listenTo(Todos, 'add', this.addOne);
    this.listenTo(Todos, 'reset', this.addAll);
    this.listenTo(Todos, 'change:completed', this.filterOne);
    this.listenTo(Todos, 'filter', this.filterAll);
    this.listenTo(Todos, 'all', this.render);

    Todos.fetch();

    super();
	}

	render(eventsName) {

		console.log('eventsName: ' + eventsName);

		var completed = Todos.completed().length; // const
    var remaining = Todos.remaining().length; // const

    if (Todos.length) {
      this.$main.show();
      this.$footer.show();

      this.$footer.html(
        this.statsTemplate({
          completed, remaining
        })
      );

      this.$('#filters li a')
        .removeClass('selected')
        .filter('[href="#/' + (TodoFilter || '') + '"]')
        .addClass('selected');

    } else {
      this.$main.hide();
      this.$footer.hide();
    }

    this.allCheckbox.checked = !remaining;
	}

	addOne(model) {
		var view = new TodoView({model});
		$('#todo-list').append(view.render().el);
	}

	addAll() {
		this.$('#todo-list').html('');
		Todos.each(this.addOne, this);
	}

	filterOne(todo) {
		todo.trigger('visible');
	}

	filterAll() {
		Todos.each(this.filterOne, this);
	}

	newAttributes() {
    return {
      title: this.$input.val().trim(),
      order: Todos.nextOrder(),
      completed: false
    };
  }

  createOnEnter(e) {
    if (e.which !== ENTER_KEY || !this.$input.val().trim()) {
      return;
    }

    Todos.create(this.newAttributes());
    this.$input.val('');
  }

  clearCompleted() {
    _.invoke(Todos.completed(), 'destroy');
    return false;
  }

  toggleAllComplete() {
    var completed = this.allCheckbox.checked; // const
    Todos.each(todo => todo.save({ completed }));
  }

}

export class Filters extends Router {

	constructor() {
		super();

		this.routes = {
			'*filter': 'filter'
		}

		this._bindRoutes();
		super();
	}

	filter(param = '') {
		TodoFilter = param;

		Todos.trigger('filter');
	}

}
