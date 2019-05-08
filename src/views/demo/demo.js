require('./demo.css')
import $ from 'jquery'
window.$ = $
window.jQuery = $
import demo from './demo.ejs';

$('#J-btn1').click(function () {
    alert('hello');
});