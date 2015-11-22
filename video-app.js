var app = angular.module('videoApp', ['ngAnimate']);

app.controller('VideoController', VideoController);
app.filter('time', time);
app
.constant('SRC', 'video/StarlightScamper.mp4')
.constant('TTILE', 'StarlightScamper');

function time() {

	var filterFunc = function(seconds){

		var hh = Math.floor(seconds / 3600), 
			mm = Math.floor(seconds / 60) % 60,
			ss = Math.floor(seconds) % 60;

		return hh + ":" + ( mm < 10 ? "0" : "" ) + (ss < 10 ? "0": "") + ss
	}
	return filterFunc;
}

function VideoController(SRC, TTILE, $scope, $interval, $http) {

    var vm  			= this;
    vm.titleDisplay 	= TTILE;
    vm.videoSource 		= SRC;
    vm.playerStatus 	= 'pause';
    vm.volumeStatus 	= 'up';
    vm.scrubTop 		= -1000;
    vm.scrubLeft 		= -1000;
    vm.vidHeightCenter  = -1000;
    vm.vidWidthCenter	= -1000;
    vm.isDragging       = false;

    vm.currentTime;
    vm.totalTime;
    vm.play 			= play;
    vm.pause 			= pause;
    vm.stop 			= stop;
    vm.toggleVolume 	= toggleVolume;
    vm.startPlayback 	= startPlayback;
   	vm.initPlayer 		= initPlayer;
   	vm.updateTime 		= updateTime;
   	vm.updateData 		= updateData;
   	vm.dragStart        = dragStart;
   	vm.videoSeek		= videoSeek;
   	vm.mouseMoving		= mouseMoving;
   	vm.dragStop			= dragStop;
   	vm.toggleFullscreen = toggleFullscreen;
   	vm.toggleDetails	= toggleDetails;
   	vm.showOptions		= false;
   	vm.videoSelected	= videoSelected;



   	$interval(function(){
   		if(!vm.isDragging) {
   			var t = video.currentTime;
	        var d = video.duration;
	        var w = t / d * 100;
	        var p = document.getElementById('progressMeterFull').offsetLeft + document.getElementById('progressMeterFull').offsetWidth;

	        vm.scrubLeft = ( t / d * p ) - 7;	
   		}else {
			vm.scrubLeft = document.getElementById('thumbScrubber').offsetLeft;	
   		}
   		
   		updateLayout();
   		
   	},100);

   	vm.initPlayer();

   	function mouseMoving($event) {
   		if(vm.isDragging) {
   			$('#thumbScrubber').offset({ left: $event.pageX });
   		}
   	}

   	function dragStart($event) {
   		console.log('drag start event');
		vm.isDragging = true;
   	}

   	function dragStop($event){

   		
   		if(vm.isDragging) {
   			vm.videoSeek($event);
   			vm.isDragging = false;
   		}
   	}

   	function videoSeek($event) {
   		var w = document.getElementById('progressMeterFull').offsetWidth;
   		var d = video.duration;
   		var s = Math.round( $event.pageX / w * d );
   		video.currentTime = s;
   	}

   	function initPlayer() {
   		
   		video = document.getElementById('VideoElement');

   		vm.currentTime = 0;
    	vm.totalTime = 0;
    	
    	console.log(video);

    	video.addEventListener("timeupdate", vm.updateTime, true);
    	video.addEventListener("loadedmetadata", vm.updateData, true);

    	//Loading Playlist
    	$http.get('data/playlist.json').success(function(data){
    		vm.playlist = data;
    		console.log(vm.playlist);
    	});
   	}

   	function updateTime(e) {
   		vm.currentTime = e.target.currentTime;

   		if( vm.currentTime == vm.totalTime ) {
   			stop();
   		}

   	}

   	function updateData(e) {
   		vm.totalTime = e.target.duration;
   	}

   	function updateLayout(){

   		vm.scrubTop = document.getElementById('progressMeterFull').offsetTop-2;
   		vm.vidHeightCenter = video.offsetHeight/2 - 50;
   		vm.vidWidthCenter = video.offsetWidth/2 - 50;

   		if(!$scope.$$phase){
   			$scope.$apply();
   		}
   	}

    

    function startPlayback() {
    	play();
    }
    function play(){
    	video.play();
    	vm.playerStatus = 'play';
    }

    function pause(){
    	video.pause();
    	vm.playerStatus = 'pause';
    }

    function stop() {
    	video.pause();
    	vm.playerStatus = 'pause';
    	video.currentTime = 0;
    }

    function toggleVolume() {
    	if( vm.volumeStatus=='up' ) {
    		video.volume = 0.0;
    		vm.volumeStatus = 'off';
    	}else {
    		video.volume = 1.0;
    		vm.volumeStatus = 'up';
    	}
    }

    function toggleFullscreen() {
    	if(video.requestFullscreen) {
            video.requestFullscreen();
        }else if(video.mozRequestFullScreen) {
            video.mozRequestFullScreen();
        }else if(video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
        }else if(video.msRequestFullscreen) {
            video.msRequestFullscreen();
        }
    }

    function toggleDetails() {
    	vm.showOptions = !vm.showOptions;
    }

    function videoSelected($index) {
    	vm.description 		= 	vm.playlist[$index].description;
    	vm.title       		= 	vm.playlist[$index].title;
    	vm.videoSource		=	vm.playlist[$index].path;

    	console.log(vm.videoSource);

    	video.load(vm.videoSource);
    }

}

