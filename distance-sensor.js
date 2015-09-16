/**
 * Example usage:
 *
 * var DistanceSensor = new (require("./distance-sensor.js"))();
 * DistanceSensor
 *  .setTriggerPin(17)
 *  .setEchoPin(27)
 *  .setDistanceChangeCallbackFunction(function(distance) {
 *               console.log(distance);
 * }.bind(DistanceSensor))
 * .init();
 *
 */
/**
 * Provides proximity detection functionality for the HC-SR04 Ultrasonic Module.
 *
 * NOTE:
 * Requires:
 * https://www.npmjs.com/package/r-pi-usonic
 * See link above for wiring documentation.
 *
 * @constructor
 */
var DistanceSensor = function() {
    var echoPin, // https://www.npmjs.com/package/r-pi-usonic
        triggerPin,
        usonic = require('r-pi-usonic'),
        distanceChangeCallbackFunction,
        sensor,
        readDistanceTimeoutHandler,
        distanceReadInterval = 60; // Milliseconds.

    /**
     * Sets the ECHO GPIO pin number.
     * @param value
     * @returns {DistanceSensor}
     */
    this.setEchoPin = function(value) {
        echoPin = value;
        return this;
    };

    /**
     * Returns the ECHO GPIO pin number.
     * @returns {Number}
     */
    this.getEchoPin = function() {
        return echoPin;
    };

    /**
     * Sets Trigger GPIO pin number.
     * @param value
     * @returns {DistanceSensor}
     */
    this.setTriggerPin = function(value) {
        triggerPin = value;
        return this;
    };

    /**
     * Returns Trigger GPIO pin number.
     * @returns {Number}
     */
    this.getTriggerPin = function() {
        return triggerPin;
    };

    /**
     * Function to call once distance signal is received.
     * @param cb
     * @returns {DistanceSensor}
     */
    this.setDistanceChangeCallbackFunction = function(cb) {
        distanceChangeCallbackFunction = cb;
        return this;
    };

    /**
     * Returns the distance signal callback function.
     * @returns {*}
     */
    this.getDistanceChangeCallbackFunction = function() {
        return distanceChangeCallbackFunction;
    };

    /**
     * Sets the r-pi-usonic instance.
     * @param s
     * @returns {DistanceSensor}
     */
    this.setSensor = function(s) {
        sensor = s;
        return this;
    };

    /**
     * Returns the r-pi-usonic instance.
     * @returns {*}
     */
    this.getSensor = function() {
        return sensor;
    };

    /**
     * Function used for handling a timeout.
     * @function
     */
    readDistanceTimeoutHandler = function() {
        var distance = this.getSensor()();
        if (distance !== -1) {
            this.getDistanceChangeCallbackFunction()(distance.toFixed(2));
        }
        setTimeout(readDistanceTimeoutHandler.bind(this), distanceReadInterval);
    };

    /**
     * Function used for initializing the sensor.
     * @function
     */
    this.init = function() {
        this.setSensor(usonic.createSensor(
            this.getEchoPin(),
            this.getTriggerPin()
        ));

        setTimeout(readDistanceTimeoutHandler.bind(this), distanceReadInterval);
    };
};

module.exports = DistanceSensor;