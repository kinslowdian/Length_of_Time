var trace = function(msg){ console.log(msg); };

var timeData;
var clock;
var enterFrame;
var buildDelay;
var preloader;
var firstLoad;

function timeList_init(event)
{
	trace(this);

	preloader = document.querySelector(".preloader");

	timeData 						= {};
	timeData.data 			= new Date(Date.now());
	timeData.read 			= {};
	timeData.read.h 		= timeData.data.getHours();
	timeData.read.m 		= timeData.data.getMinutes();
	timeData.read.s 		= timeData.data.getSeconds();
	timeData.current 		= {};
	timeData.current.h	= 0;
	timeData.current.m	= 0;
	timeData.current.s 	= 0;
	// timeData.current.h	= timeData.read.h;
	// timeData.current.m	= timeData.read.m;
	// timeData.current.s 	= timeData.read.s;
	timeData.output			= "";

	clock = {};
	clock.gfx = document.querySelector("#display .time");
	clock.timeStore = new Array();
	clock.timePosition = new Array();
	clock.timeSelect = 0;
	clock.currentDigit = null;
	clock.seconds = {};
	clock.seconds.gfx = document.querySelector("#display .secondBar");
	clock.seconds.percentage = 100 / 59;


	enterFrame = {};
	enterFrame.instance = null;
	enterFrame.loop = false;

	firstLoad = true;
	buildDelay = setTimeout(timeList_displayWrite, 1000);
	// timeList_displayWrite();
}

function timeList_displayWrite()
{
	var arrayRef = 0;

	// HOURS
	for(var i = 0; i < 24; i++)
	{
		var hm = "";
		var _h = 0;
		var _m = 0;

		if(i < 10)
		{
			_h = "0" + i;
		}

		else
		{
			_h = i;
		}

		for(var j = 0; j < 60; j++)
		{
			var timeLine;

			if(j < 10)
			{
				_m = "0" + j;
			}

			else
			{
				_m = j;
			}
			hm = _h + ':' + _m;

			clock.gfx.innerHTML += '<li class="timeValue_' + arrayRef + ' tween">' + hm + '</li>';

			timeLine = document.querySelector("#display .timeValue_" + arrayRef);

			clock.timeStore.push(hm);
			clock.timePosition.push(timeLine.offsetTop);
			arrayRef++;
		}
	}

	// FORMAT
	time_format();

	// START LOOP
	enterFrame_init(true);

	if(firstLoad)
	{
		firstLoad = false;
		preload_remove();
	}
}

function time_check()
{
	var amend = false;

	// HOUR + MINS
	if(timeData.read.h != timeData.current.h || timeData.read.m != timeData.current.m)
	{
		amend = true;
	}

	// SECS
	if(timeData.read.s != timeData.current.s)
	{
		clock.seconds.gfx.style.height = (timeData.read.s * clock.seconds.percentage) + "%";
		timeData.current.s = timeData.read.s;
	}

	if(amend)
	{
		time_format();

		for(var i = 0; i < clock.timeStore.length; i++)
		{
			if(timeData.output === clock.timeStore[i])
			{
				clock.timeSelect = i;

				timeList_moveApply();

				timeData.current.h = timeData.read.h;
				timeData.current.m = timeData.read.m;
				// timeData.current.s = timeData.read.s;

				break;
			}
		}
	}
}

function time_format()
{
	var _h 		= 0;
	var _m 		= 0;


	if(timeData.read.h < 10)
	{
		_h = "0" + timeData.read.h;
	}

	else
	{
		_h = timeData.read.h;
	}

	if(timeData.read.m < 10)
	{
		_m = "0" + timeData.read.m;
	}

	else
	{
		_m = timeData.read.m;
	}

	timeData.output = _h + ':' + _m;
}

function timeList_moveApply()
{
	var digit = document.querySelector("#display .timeValue_" + clock.timeSelect);

	if(clock.currentDigit != null)
	{
		clock.currentDigit.classList.remove("on");
	}

	digit.classList.add("on");
	clock.gfx.style.transform = 'translateY(' + -clock.timePosition[clock.timeSelect] + 'px)';
	clock.currentDigit = digit;
}

function enterFrame_init(run)
{
	if(run)
	{
		enterFrame.loop = true;
		enterFrame.instance = window.requestAnimationFrame(enterFrame_loop);
	}

	else
	{
		enterFrame.loop = false;
		window.cancelAnimationFrame(enterFrame.instance);
	}
}

function enterFrame_loop()
{
	timeData.data = new Date(Date.now());

	timeData.read.h = timeData.data.getHours();
	timeData.read.m = timeData.data.getMinutes();
	timeData.read.s = timeData.data.getSeconds();

	// SECOND UPDATE
	if(timeData.read.s != timeData.current.s)
	{
		time_check();
	}

	// REFRESH
	if(enterFrame.loop)
	{
		enterFrame.instance = window.requestAnimationFrame(enterFrame_loop);
	}
}

function preload_remove()
{
	clock.gfx.classList.add("time-tween");

	preloader.addEventListener("transitionend", preload_remove_event, false);
	preloader.style.transform = "translateX(-100%)";
}

function preload_remove_event(event)
{
	preloader.removeEventListener("transitionend", preload_remove_event, false);
	preloader.remove();
	preloader = null;
}
