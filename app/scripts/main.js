'use strict';

(function ( $ ) {
 	
 	//@protected variable. keeps the instance of the generated calendar
	var calendarElDOM,
		initCalValue;

    $.fn.tmgCalendar = function( options ) {

    	//Default Attributes
    	var settings = $.extend({
            disabledDaysWeek : [7], //Array of days disabled. Monday = 1, Tuesday = 2, etc.
            numVisibleDays: 180, //Number of days loaded by the calendar
            holidays: [], //Array of holidays.
            numDisabledRows: 2, //Number of disabled rows displayed
            responsive: false
        }, options);

        return this.each(function(){

        	var el = $(this),
        		elValue = el.val();

        	//If the input has a default value use the date to be displayed as default
        	if( elValue.length > 0 && (elValue.match(/^(\d{2})\-(\d{2})\-(\d{4})$/)) ){
        		initCalValue = elValue;
        	}else{
        		initCalValue = '';
        	}
        	//For each element, sets and triggers the tmgCalendar Conf.
        	calendarElDOM = createHtml(el, settings);
	 		fillCalendar(settings, calendarElDOM);
	 		bindFunctionsCalendar(el, calendarElDOM);
	 		bindFunctionInput(el, calendarElDOM);
        });
    };
    
    //Binds the click event on the input tied to the plugin
    function bindFunctionInput(el, calendarElDOM){

    	el.off().on('click', function(e){
    		$('.tmg-calendar').hide();//Hides all visible calendars
    		calendarElDOM.fadeIn();
    		e.preventDefault();
    	});
    }

    //Binds the click events on each day of the calendar
    function bindFunctionsCalendar(el, calendarElDOM){

    	calendarElDOM.find('.tmg-calendar-day').off().on('click', function(e){

    		var self = $(this);
    		if( !self.hasClass('disable') ){
    			calendarElDOM.find('.tmg-calendar-day.selected').removeClass('selected');
    			self.addClass('selected');
    			el.val(self.data('date'));
    			initCalValue = self.data('date');
    			calendarElDOM.fadeOut();
    		}
    		e.preventDefault();
    	});

    	calendarElDOM.find('.tmg-calendar-close').off().on('click', function(e){
    		calendarElDOM.fadeOut();
    		e.preventDefault();
    	});
    }

    //Created the calendar HTML
    function createHtml(el, settings){

    	var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    		tmgDate = new Date(),
    		currentMonthName = monthNames[tmgDate.getMonth()],
    		currentYear = tmgDate.getFullYear(),
    		responsive = settings.responsive === true ? 'responsive' : '';



		/*jshint multistr: true */
    	var tmgCalendarHTML = '<div class="tmg-calendar '+responsive+'"><div class="arrow-up"></div>\
						          <div class="tmg-calendar-wrap">\
						            <div class="tmg-calendar-header">\
						              <a href="#" class="tmg-calendar-close"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>\
						              <h4 class="tmg-calendar-title">'+currentMonthName+' '+currentYear+'</h4>\
						              <div class="row">\
						                <div class="col-xs-14 tmg-calendar-day-header">Mo</div>\
						                <div class="col-xs-14 tmg-calendar-day-header">Tu</div>\
						                <div class="col-xs-14 tmg-calendar-day-header">We</div>\
						                <div class="col-xs-14 tmg-calendar-day-header">Th</div>\
						                <div class="col-xs-14 tmg-calendar-day-header">Fr</div>\
						                <div class="col-xs-14 tmg-calendar-day-header">Sa</div>\
						                <div class="col-xs-14 tmg-calendar-day-header">Su</div>\
						              </div>\
						            </div>\
						            <div class="tmg-calendar-days row"></div>\
						          </div>\
						        </div>';
		return el.after(tmgCalendarHTML).next('.tmg-calendar');						        
    }

    //Verifies if is leap year.
    function checkLeapDay(year){

    	var isLeap = new Date(year, 1, 29).getMonth() === 1;
    	return isLeap;
    }

    //Fills the calendar HTML with the days
    function fillCalendar(settings, calendarElDOM){
		
    	var months = [
    		{ 'name': 'JAN', 'long': 31} ,
    		{ 'name': 'FEB', 'long': 28} ,
    		{ 'name': 'MAR', 'long': 31} ,
    		{ 'name': 'APR', 'long': 30} ,
    		{ 'name': 'MAY', 'long': 31} ,
    		{ 'name': 'JUN', 'long': 30} ,
    		{ 'name': 'JUL', 'long': 31} ,
    		{ 'name': 'AGO', 'long': 31} ,
    		{ 'name': 'SEP', 'long': 30} ,
    		{ 'name': 'OCT', 'long': 31} ,
    		{ 'name': 'NOV', 'long': 30} ,
    		{ 'name': 'DEC', 'long': 31} ,
    	];

    	var tmgDate = new Date(),
    		tmgMonth = tmgDate.getMonth(),
    		tmgDay = tmgDate.getDate(),
    		tmgDayWeek = tmgDate.getDay(),
    		tmgYear = tmgDate.getFullYear(),
    		tmgDaysPrevVisible = (tmgDayWeek-1) + (settings.numDisabledRows * 7),
    		tmgCalendarDays = calendarElDOM.find('.tmg-calendar-days'),
    		currentDayWeek = 1,
    		renderStartDay = 1,
    		renderStartMonth = 0,
    		renderStartYear = 0;

    	//Verifies if the current year is leap year
		if(checkLeapDay(tmgYear)){ 
			months[1].long = 29;
		}

		//Calculates the days of the week that should be disabled
		if( tmgDaysPrevVisible > tmgDay ){
			renderStartDay = months[tmgMonth - 1].long - (tmgDaysPrevVisible - tmgDay);
			renderStartMonth = tmgMonth - 1;
			renderStartYear = tmgYear;

		}else{
			renderStartDay = tmgDay - tmgDaysPrevVisible;
			renderStartMonth = tmgMonth;
			renderStartYear = tmgYear;
		}

		for( var i = 0; i < settings.numVisibleDays; i++){

			//Adds support to change of year
			if( renderStartMonth > 11 ){
				renderStartMonth = 0;
				renderStartYear++;

				//Verifies if the new year is leap year
				if(checkLeapDay(renderStartYear)){ 
					months[1].long = 29;
				}
			}
			
			//Renders each month till the long of the month
			for( var j = renderStartDay; j <= months[renderStartMonth].long; j++){

				var styleDay = '';

				//Check if is filling previous days to the starting point and disables them
				if( renderStartMonth < tmgMonth && renderStartYear <= tmgYear ){
					styleDay = 'disable';
				}else if( renderStartMonth === tmgMonth ){
					if( j < tmgDay ){
						styleDay = 'disable';
					}
				}

				//Checks if the day should be disabled
				if( $.inArray(currentDayWeek, settings.disabledDaysWeek) !== -1 ){
					styleDay = 'disable';
				}

				//Check if is part of the holidays
				var currentDateMonth = renderStartMonth < 9 ? '0'+(renderStartMonth+1) : (renderStartMonth+1),
					currentDateDay = j < 10 ? '0'+j : j,
					currentDate = currentDateDay+'-'+currentDateMonth+'-'+renderStartYear;

				if( $.inArray(currentDate, settings.holidays) !== -1 ){
					styleDay = 'disable';
				}

				//Checks if We've reached the end of the week
				if( currentDayWeek === 7 ){
					currentDayWeek = 0;//Is sunday, restarts the week counter
				}

				// If is the first day of the month, renders a special HTML
				if( j === 1 ){
					var monthString = months[renderStartMonth].name.split('');
					tmgCalendarDays.append('<a href="#" data-date="'+currentDate+'" class="col-xs-14 tmg-calendar-day '+styleDay+' '+i+'"><div class="tmg-calendar-month"><span>'+monthString[0]+'</span><span>'+monthString[1]+'</span><span>'+monthString[2]+'</span></div>'+j+'</a>');
				}else{
					tmgCalendarDays.append('<a href="#" data-date="'+currentDate+'" class="col-xs-14 tmg-calendar-day '+styleDay+' '+i+'">'+j+'</a>');  	
				}

				currentDayWeek++;
				i++;

				//Stops when we've reach settings.numVisibleDays days
				if( i > settings.numVisibleDays ){
					break;
				}
			}

			//Change of month, restarts the counters
			renderStartDay = 1;			
			renderStartMonth++;
		}

		//In case theres a initial calendar value, marks it as selected when opened
		calendarElDOM.find('[data-date=\''+initCalValue+'\']').addClass('selected');
    }
 
}( jQuery ));