// Script to find all IFRAMES on a page and, if they are of a certain media type, wrap them in a DIV so that they can be styled to be responsive
/* global $ */
/*eslint-env browser*/
/*
$(document).ready(function(){
	"use strict";
	$('iframe[src*="youtube.com"]').wrap('<div class="youtubeWrapper" />'); 
	$('iframe[src*="vimeo.com"]').wrap('<div class="vimeoWrapper" />');
	$('iframe[src*="instagram.com"]').wrap('<div class="instagramWrapper" />');
});
*/
$(document).ready(function(){
	"use strict";
	var trigger = $('.hamburger'),
		overlay = $('.overlay'),
		isClosed = false;
	trigger.click(function(){
		hamburger_cross();      
    });
	function hamburger_cross(){
		if (isClosed === true){
			overlay.hide();
			trigger.removeClass('is-open');
			trigger.addClass('is-closed');
			isClosed = false;
		} else {
			overlay.show();
			trigger.removeClass('is-closed');
			trigger.addClass('is-open');
			isClosed = true;
		}
	}
	$('[data-toggle="offcanvas"]').click(function(){
		$('#wrapper').toggleClass('toggled');
	});
});
// contact
/*
$(document).ready(function($){
	$('.contact-form input.name').attr('placeholder', 'Full Name');
	$('.contact-form input.email').attr('placeholder', 'Email');
	$('.contact-form textarea.textarea').attr('placeholder', 'Message');
});
*/
// jump to video marker
/*
var introvid = document.getElementById('introvid'),
markone = document.getElementById('mrk1'),
marktwo = document.getElementById('mrk2'),
markthree = document.getElementById('mrk3');

markone.addEventListener("click", function (event) {
	event.preventDefault();
	introvid.play();
	introvid.pause();
	introvid.currentTime = 20;
	introvid.play();
}, false);

marktwo.addEventListener("click", function (event) {
	event.preventDefault();
	introvid.play();
	introvid.pause();
	introvid.currentTime = 102;
	introvid.play();
}, false);

markthree.addEventListener("click", function (event) {
	event.preventDefault();
	introvid.play();
	introvid.pause();
	introvid.currentTime = 372;
	introvid.play();
}, false);

// Tooltips Initialization
$(function () {
    "use strict";
    $('[data-toggle="tooltip"]').tooltip()
})
*/