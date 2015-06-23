Javie
=====

Javie Client-side JavaScript Library is simple toolkit written for Client-side JavaScript. The toolkit can be use separately and only requires file that is marked in the documentation. All the object use object combined with factory pattern to make a reusable global instance or multi-instance (depend which is better).

## Javie

`Javie` simplify the way you define your environment, for instance profiler and logger should only run in "dev" invironment.

```javascript
/* Define the environment to `dev` */
Javie.detectEnvironment(function () {
  return "dev"
})

Javie.when('dev', function initiateDevEnv () {
  // do something on just dev environment.
  this.make('profiler').enable()
  this.make('log').enable()
})

Javie.when('production', function initiateProdEnv () {
  // do something on just production environment.
  this.make('profiler').enable()
  this.make('log').enable()
})

Javie.run(function initiateAllEnv () {
  // this will be run in any environment.
})
```

## Event Dispatcher

`Javie.EventDispatcher` is a publisher/subscriber object that you can use in your app, in a way it's similar to `jQuery.bind` and `jQuery.trigger` except that the event is not attach to any DOM element.

```javascript
var ev = Javie.make('event')

var say = ev.listen('simon.say', function (say) {
  jQuery('<p>').text(say).appendTo('body')
})

ev.fire('simon.say', ['hello world'])
ev.fire('simon.say', ['good morning'])
ev.fire('simon.say', ['goodbye'])

// the fire('simon.say') action above will create <p>hello world</p><p>good morning</p><p>goodbye</p>

// to remove an action
ev.forget(say)

// now fire('simon.say') wouldn't do anything
ev.fire('simon.say', ['does not output anything'])
```

In Javie, we use `Javie.EventDispatcher` on top of `Javie.Request` to allow you to add attach event to any `Javie.Request` call. Let say you want to get the amount of time it took for each request.

```javascript
var ev, p

ev = Javie.make('event')
p  = Javie.make('profiler')

ev.listen('Request.beforeSend', function (self) {
  p.time(self.get('name') + '.request', 'Time taken for the request')
})

ev.listen('Request.onComplete', function (data, status, self) {
	p.timeEnd(self.get('name') + '.request')
})
```

## Profiler

Profile your application the easy way, the functionality is wrapped around V8 or Firebug `console` and default to disabled unless required to run. This allow the code to sit nicely between DEVELOPMENT and PRODUCTION environment.

```javascript
var p = Javie.make('profiler')

// Enable the Profiler
p.enable()

// Disable the Profiler
p.disable()
```

Let start with a simple profiling.

```javascript
var p = Javie.make('profiler', 'default')

// start a time log
p.time('benchmark.a', 'Some description')

for (var i = 100; i--; )
  console.log(i)

// marked an end time
p.timeEnd('benchmark.a')

/*
 * In addition you can also ignore start time and based the timestamp
 * to the first instance loaded time
 */
p.timeEnd('benchmark.b', 'Compared to Profiler.make()')
```

Trace function call up to now.

```javascript
p.trace()
```

To compile the output, use `Javie.Profiler::output()`

```javascript
p.output()
```

## Log

Log your application without any worries, the function is wrapped around V8 ir Firebug `console` and default to disabled unless required to run. This allow the code to sit nicely between DEVELOPMENT and PRODUCTION environment.

```javascript
var log = Javie.make('log')

// Enable the Logger
log.enable()

// Disable the Logger
log.disable()
```

Let start with logging.

```javascript
var writer = Javie.make('log.writer')

// submit a error
writer.error('It a error')

// submit a warn
writer.warn('It a warning')

// submit a debug message
writer.debug('It a debug')

// submit a info
writer.info('It a info')

// submit a log
writer.log('It a log')
```

## Request

`Javie.Request` is a quick way to use RESTful request on top of `jQuery.ajax` or `Zepto.ajax`. You can choose whether to use `GET`, `POST`, `PUT` or `DELETE` and the object will manage everything else.

```javascript
jQuery('#register-form').bind('submit', function onRegisterFormSubmit (e) {
  e.preventDefault()

  var r = Javie.make('request', 'register')
  r.to('POST /register.php', this).execute()
})
```

Using `Javie.EventDispatcher`, you can attach as many event as you wish to either global or individual name that you identify when you run `Javie.Request('register')` (in this case the name would be `register`).

```javascript
var ev = new Javie.make('event')

ev.listen('Request.beforeSend: register', function beforeSend (self) {
  // this will be run before Ajax request is send to server.
})

ev.listen('Request.onError: register', function onValidationError (data, status, self) {
  // this will be run if server return json containing { 'errors' : [ ] }
})

ev.listen('Request.onComplete: register', function (data, status, self) {
  // this will be run once the request is completed.
})
```

## Requirement

* jQuery/Zepto
* Underscore.js
* Modern browser with `console` support.

## License

	The MIT License

	Copyright (C) 2012 by Mior Muhammad Zaki <http://git.io/crynobone>

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
