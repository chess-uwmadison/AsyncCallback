/**
 * AsyncCallback.js
 * 
 * @Description: A library for calling Javascript functions after some work has been done asynchronously
 * 
 * @Version: 1.0.0
 *
 * @Author: Adam Maus (adam.maus@wisc.edu)
 * @Organization: Center for Health Enhancement Systems Studies
 * @LastUpdated: 13:10 PM 11/9/2015
 */
function AsyncCallback(params) { 
	/*
	 * The queue of callback functions
	 */
	this.callbackQueue = [];
	
	/*
	 * Parameters for the callback functions
	 */
	this.callbackQueueParams = [];
	
	/*
	 * The interval in which the queue is checked (in milliseconds)
	 */
	this.intervalTime = 1000;
	
	/*
	 * The interval variable used to check the callback queue
	 */
	this.interval = null;
	
	/*
	 * Add a function to the callback queue
	 * 
	 * @param function f: An anonymous function to call
	 * @param mixed params: Data to pass to the anonymous function
	 * @return null
	 *
	 * @since 1.0.0
	 */
	this.add = function(f, params) {
		if (typeof(f) === "undefined") {
			throw "Invalid function: AsyncCallback.add()";
		}
		
		this.callbackQueue.push(f);
		
		if (typeof(f) === "undefined") {
			this.callbackQueueParams.push(null);
		} else {
			this.callbackQueueParams.push(params);
		}
	}
	
	/*
	 * Execute functions in the queue
	 *
	 * @return null
	 *
	 * @since 1.0.0
	 */	
	this.execute = function() {
		var i = 0;
		while (i < this.callbackQueue.length) {
			var f = this.callbackQueue[i];
			var params = this.callbackQueueParams[i];
			
			// Call the function
			f(params);
			
			i++;
		}
		
		this.callbackQueue = [];
		this.callbackQueueParams = [];
	}
	
	/*
	 * Set the callback interval time
	 *
	 * @return null
	 *
	 * @since 1.0.0
	 */
	this.resetTime = function(intervalTime) {
		this.intervalTime = intervalTime;
		this.restart();
	}
	
	/*
	 * Restart the callback interval
	 *
	 * @return null
	 *
	 * @since 1.0.0
	 */
	this.restart = function() {		
		this.stop();
		this.start();
	}	
	
	/*
	 * Start the callback interval
	 *
	 * @return null
	 *
	 * @since 1.0.0
	 */
	this.start = function() {		
		var a = this;
		this.interval = window.setInterval(function() {
				a.execute(); 
			}, this.intervalTime);
	}
	
	/*
	 * Stop the callback interval
	 *
	 * @return null
	 *
	 * @since 1.0.0
	 */
	this.stop = function() {
		window.clearInterval(this.interval);
	}
	
	// Start the interval unless params["autostart"] = false has been passed
	if (typeof(params) === "undefined" || (params["autostart"] != null && params["autostart"] != false)) {
		this.start();
	}
}; // End AsyncCallback class

/**
 * Usage:
 * 	1) Create a global AsyncCallback object
 *  2) Call a page using Ajax
 *  3) In the callback function when the page has returned, "Add" functions with the parameters you want to execute to the AsyncCallback object
 *  4) The function will be executed within the intervalTime (by default: 1 second)
 **/