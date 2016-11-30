// Detect IE
var browserIE = false;
if(whichBrs() == 'Internet Explorer') browserIE = true;

// Detect Mobile
var browserMobile = false;
if($('body').hasClass('layout-mobile')) browserMobile = true;

// Elements
var $wrapper = $('#wrapper'),
	$header = $('header'),
	$section = $('section'),
	$footer = $('footer'),
	$valign = $('.valign'),
	$fullHeight = $('.full-height'),
	$imgFit = $('.img-fit'),
	$toLoad = $('.to-load, .to-load-block'),
	$svgs = $('.svg');

var animRunning = false,
	currentScroll = -1,
	InfiniteSliderCSS,
	compassAngle = 0,
	vivusArray = [];

$('html,body').scrollTop(0);

if($('#section-home').length == 1 && !$('body').hasClass('layout-visited')){
	$('#loading-mask-home').show();
	$('#loading-mask-normal').hide();
} 

$(document).ready(function(){
	if($('#section-home').length == 1 && !$('body').hasClass('layout-visited')){
		$('#loading-mask-normal').addClass('loaded to-leave');
		$('#loading-mask-home').addClass('loaded');
		var preloader = new PNGPreloader($('#loading-mask-logo'),109,175,175,50,false);
		preloader.start();
	}
});

$(window).load(function(){
	/* ////////////////////////////////////////
	//
	// General
	//
	/////////////////////////////////////// */

	// Header - Menu
	$('.btn-toggle', $header).on('click', function(){
		$header.toggleClass('opened');
		return false;
	});

	// Slider Right
	InfiniteSliderCSS = new InfiniteSlider($('#slider-container-right'),1500,5000,'slide','easeInOutQuart',false,false);

	$('#slider-container-right .slider').on('click', function(){
		// Open
		if($('section > .content-right').hasClass('closed')){
			$('section > .content-right').css({'transition-duration': '0.95s', '-webkit-transition-duration': '0.95s'}).removeClass('closed');
			InfiniteSliderCSS.reset(InfiniteSliderCSS);
			$('.content-right-overlay').stop().fadeIn(950, function(){
				$('section > .content-right').css({'transition-duration': '0s', '-webkit-transition-duration': '0s'});
			});
		}
		// Close
		else {
			$('section > .content-right').css({'transition-duration': '0.95s', '-webkit-transition-duration': '0.95s'}).addClass('closed');
			InfiniteSliderCSS.reset(InfiniteSliderCSS);
			$('.content-right-overlay').stop().fadeOut(950, function(){
				$('section > .content-right').css({'transition-duration': '0s', '-webkit-transition-duration': '0s'});
			});
		}
	});

	$('.content-right-overlay').on('click', function(){
		$('#slider-container-right .slider').trigger('click');
	});

	// Footer - Back Top
	$('footer .btn-top').on('click', function(){
		$('html,body').stop().animate({scrollTop: 0}, 1250, 'easeInOutQuad');
		return false;
	});

	// Links
	$('a').on('click', function(){
		var $object = $(this);
		var link = $object.attr('href');
		if($object.attr('target') != '_blank' && link != '' && link != '#' && link.indexOf('mailto') == -1){
			$('#loading-mask-normal').show();
			setTimeout(function(){
				$('#loading-mask-normal').addClass('leaving');
				setTimeout(function(){
					window.location.href = link;
				}, 1500);
			}, 100);

			return false;
		}
	});

	/* ////////////////////////////////////////
	//
	// Maps
	//
	/////////////////////////////////////// */

	// Scroll Down
	$('#section-wines .block-map .btn-down').on('click', function(){
		$('html,body').stop().animate({scrollTop: $('#section-wines .block-map').offset().top}, 1250, 'easeInOutQuad');
		return false;
	});

	/* ////////////////////////////////////////
	//
	// Init
	//
	/////////////////////////////////////// */

	if($('#slider-container-right').length == 1) $footer.addClass('small');

	positionContent();
	// Load Homepage
	if($('#section-home').length == 1 && !$('body').hasClass('layout-visited')){
		setTimeout(function(){
			$('#loading-mask-home').addClass('leaving');
			$('#loading-mask-home').delay(100).fadeOut(1250);

			setTimeout(function(){
				showPage();
			}, 750);
		}, 2750);
	}
	// Other Pages
	else {
		$('#loading-mask-normal').addClass('loaded');
		setTimeout(function(){
			showPage();
		}, 1250);

		setTimeout(function(){
			$('#loading-mask-normal').hide().addClass('to-leave');
		}, 1750);
	}
}).resize(function(){
	positionContent();
}).scroll(function(){
	scrollContent();
}).mousemove(function(e){
	if($('.compass').length >= 1) {
		var box = $('.compass > div');
		var boxCenter=[box.offset().left+box.width()/2, box.offset().top+box.height()/2];
		var angle = Math.atan2(e.pageX- boxCenter[0], - (e.pageY- boxCenter[1]) )*(180/Math.PI);
		if(angle < 0) angle = 360 + angle;

		$('.compass-arrow', box).css({'transform': 'translate(-50%, -50%) rotate(' + angle + 'deg)', '-webkit-transform': 'translate(-50%, -50%) rotate(' + angle + 'deg)'});
	}

	if($('#slider-container-right').length == 1){
		var $slider = $('#slider-container-right');
		var posX = $(window).width() - e.pageX;
		var posY = e.pageY - currentScroll;

		$('.cursor', $slider).css({'right': posX, 'top': posY});
	}
});

function showPage(){
	// SVGs
	var nb = 0;
	$('svg', $svgs).each(function(){
		var $object = $(this);
		var svgID = 'svg_nb_'+nb;
		var svgDuration = 100;
		if($object.parents('.flag-spain').length == 1 || $object.parents('.flag-usa').length == 1) svgDuration = 250;

		// Generate Unique IDs
		$object.attr('id', svgID);

		// Init Vivus
		if($object.parents('.no-intro').length < 1) vivusArray[svgID] = new Vivus(svgID, {type: 'async', start: 'manual', duration: svgDuration, forceRender: true, onReady: function(){if(!$object.parent().hasClass('no-fade')) $object.css('opacity','1');}});
		else $object.css('opacity','1');

		nb ++;
	});

	// Load general Interface
	$wrapper.addClass('loaded');
	positionContent();
	InfiniteSliderCSS.reset(InfiniteSliderCSS);
}

/* ////////////////////////////////////////////////////////////////////////////
//
// Position Content
//
/////////////////////////////////////////////////////////////////////////// */

function positionContent(){
	// Image Fit
	$imgFit.each(function(){
		var bg_main = $(this);
		var wrapper = $(this).parent();
		var wrapperWidth = wrapper.width();
		var wrapperHeight = wrapper.height();

		var bgMainSizes = $(this).attr('data-size').split('|');
		var bgMainRatio = bgMainSizes[0]/bgMainSizes[1];
		var wrapperRatio = wrapperWidth/wrapperHeight;

		if(!bg_main.hasClass('invert')) {
			if(bgMainRatio > wrapperRatio){
				bg_main
					.height(wrapperHeight)
					.width(wrapperHeight * bgMainRatio);
			} else {
				bg_main
					.width(wrapperWidth)
					.height(wrapperWidth / bgMainRatio);
			}
		} else {
			if(bgMainRatio < wrapperRatio){
				bg_main
					.height(wrapperHeight)
					.width(wrapperHeight * bgMainRatio);
			} else {
				bg_main
					.width(wrapperWidth)
					.height(wrapperWidth / bgMainRatio);
			}
		}
	});

	// Top Links - Resize
	$('section > .content-centered > .top-links', $wrapper).width($('section > .content-centered', $wrapper).width());
	// Section - Height
	$('section').css('min-height', $(window).height());

	// Homepage Block 1 - Resize
	var marginBot = $(window).height() - ($('#section-home #block-1').outerHeight() + $('#section-home #block-bestseller').outerHeight());
	if(marginBot < 0) marginBot = 0;
	$('#section-home #block-bestseller').css('margin-top', marginBot);

	// Menu Mobile
	if($(window).width() > 600) $('header, header > div nav').width('');
	else $('header, header > div nav').width($(window).width() - 60);

	scrollContent();
}

function scrollContent(){
	var totalScroll = $(document).height() - $(window).height();

	if(browserMobile){
		newScroll = $(window).scrollTop();
	} else {
		if(whichBrs() == 'Safari' || whichBrs() == 'Chrome'){
			newScroll = $('body').scrollTop();
		} else {
			newScroll = $('html,body').scrollTop();
		}
	}

	// SVGs - Parallax
	$svgs.each(function(){
		var $object = $(this);

		var buffer = $(window).height() / 2;
		var tempScroll = Math.round(($object.offset().top - buffer) - ($(window).height() + newScroll));
		var distToCover = $(window).height() + $object.height() + (buffer * 2);
		if(tempScroll > 0) tempScroll = 0;
		if(tempScroll < - distToCover) tempScroll = - distToCover;
		var ratioTranslate = - tempScroll / distToCover;
		var speed = parseFloat($object.attr('data-speed')) * 20;
		
		// Text Grid
		$('> div', $object).css({'transform': 'translate(0, '+(speed * ratioTranslate)+'px)', '-webkit-transform': 'translate(0, '+(speed * ratioTranslate)+'px)'});
	});

	// Image - Parallax
	$('#block-3 .image').each(function(){
		var $blockImg = $(this);
		var tempScroll = Math.round(($blockImg.offset().top) - ($(window).height() + newScroll));
		var distToCover = $(window).height() + $blockImg.height();
		var imgToScroll = $('img', $blockImg).height() - $blockImg.height();
		var ratioTranslate = 1 + tempScroll / distToCover;
		$('img', $blockImg).css('top', (- imgToScroll * ratioTranslate)+'px');
	});

	// To Load
	$toLoad.each(function(){
		if($wrapper.hasClass('loaded')){
			if(!$(this).hasClass('disabled')){
				var object = $(this);
				if(newScroll + $(window).height() * 0.9 > $(this).offset().top) {
					object.removeClass('no-anim');
					object.addClass('loaded');
				} else if(newScroll + $(window).height() < $(this).offset().top) {
					object.addClass('no-anim');
					object.removeClass('loaded');
				}
			}
		}
	});

	// SVGs
	$('svg', $svgs).each(function(){
		var $object = $(this);
		var svgID = $object.attr('id');

		if($wrapper.hasClass('loaded')){
			if($object.parents('.no-intro').length < 1){
				if(newScroll + $(window).height() * 0.9 > $object.offset().top) {
					if($object.attr('class') != 'animated'){
						$object.attr('class', 'animated');
						vivusArray[svgID].play();
					} 
				} else if(newScroll + $(window).height() < $object.offset().top) {
					if($object.attr('class') == 'animated'){
						$object.attr('class', '');
						vivusArray[svgID].reset();
					} 
				}
			}
		}
	});

	// Block 2 - Plane
	$('#section-home #block-2').each(function(){
		var $container = $(this);
		var tempScroll = ($(window).height() + newScroll) - $container.offset().top;
		var distToCover = $(window).height() + $container.height();

		if(tempScroll < 0) tempScroll = 0;
		if(tempScroll > distToCover) tempScroll = distToCover;

		var percFlight = tempScroll / distToCover;
		var posPlane = ($container.height() - $('.flag-spain', $container).height() * 2) * percFlight;

		$('.plane svg', $container).css({'transform': 'translate(-'+posPlane+'px, '+posPlane+'px)', '-webkit-transform': 'translate(-'+posPlane+'px, '+posPlane+'px)'});
	});

	currentScroll = newScroll;
}

/* ////////////////////////////////////////////////////////////////////////////
//
// Get Browser
//
/////////////////////////////////////////////////////////////////////////// */

function whichBrs() {
	var agt=navigator.userAgent.toLowerCase();
	if (agt.indexOf("opera") != -1) return 'Opera';
	if (agt.indexOf("staroffice") != -1) return 'Star Office';
	if (agt.indexOf("webtv") != -1) return 'WebTV';
	if (agt.indexOf("beonex") != -1) return 'Beonex';
	if (agt.indexOf("chimera") != -1) return 'Chimera';
	if (agt.indexOf("netpositive") != -1) return 'NetPositive';
	if (agt.indexOf("phoenix") != -1) return 'Phoenix';
	if (agt.indexOf("firefox") != -1) return 'Firefox';
	if (agt.indexOf("chrome") != -1) return 'Chrome';
	if (agt.indexOf("safari") != -1) return 'Safari';
	if (agt.indexOf("skipstone") != -1) return 'SkipStone';
	if (agt.indexOf("msie") != -1) return 'Internet Explorer';
	if (agt.indexOf("netscape") != -1) return 'Netscape';
	if (agt.indexOf("mozilla/5.0") != -1) return 'Mozilla';
	if (agt.indexOf('\/') != -1) {
		if (agt.substr(0,agt.indexOf('\/')) != 'mozilla') {
			return navigator.userAgent.substr(0,agt.indexOf('\/'));
		} else return 'Netscape';
	} else if (agt.indexOf(' ') != -1)
		return navigator.userAgent.substr(0,agt.indexOf(' '));
	else return navigator.userAgent;
}
