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

`Events` is a publisher/subscriber object that you can use in your app, in a way it's similar to `jQuery.bind` and `jQuery.trigger` except that the event is not attach to any DOM element.

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
