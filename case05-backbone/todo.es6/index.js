
import $ from 'jquery';
import Backbone from 'backbone';
import {AppView, Filters} from './apps/todo-app';


$(() => {

	new AppView();
	new Filters();
	Backbone.history.start();

});