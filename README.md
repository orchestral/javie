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
})

Javie.when('production', function initiateProdEnv () {
  // do something on just production environment.
})

Javie.run(function initiateAllEnv () {
  // this will be run in any environment.
})
```

## Event Dispatcher

`Events` is a publisher/subscriber object that you can use in your app.

```javascript
var say = Javie.listen('simon.say', function (say) {
  jQuery('<p>').text(say).appendTo('body')
})

Javie.emit('simon.say', ['hello world'])
Javie.emit('simon.say', ['good morning'])
Javie.emit('simon.say', ['goodbye'])

// the emit('simon.say') action above will create <p>hello world</p><p>good morning</p><p>goodbye</p>

// to remove an action
Javie.forget(say)

// now emit('simon.say') wouldn't do anything
Javie.emit('simon.say', ['does not output anything'])
```
