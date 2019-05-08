require('./demo1.css')
require('../demo/demo.css')
require('../demo/demo.js')
import $ from 'jquery'
window.$ = $
window.jQuery = $
import demo from './demo1.ejs';

$('#J-btn1').click(function () {
    alert('hello');
});