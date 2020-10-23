# Redux async action helper

You are a react redux fan or you just use redux in many projects?  
You are tired to create all the time the actions needed for an asynchronous action?  
Than ... this package may be a very handy one for you (✿◕‿◕).

## How to use? Guide:

Import asyncActionHelper from this package

```javascript
// actions.js
import { asyncActionHelper } from 'redux-async-action-helper';
```

Call the function with the name of your constant action, for example 'GET_USERS' async action, and call the new action created 'GET_USERS_ASYNC'.

```javascript
// actions.js
export const GET_USERS = 'GET_USERS';
export const GET_USERS_ASYNC = asyncActionHelper(GET_USERS);
```

What does this function, what GET_USERS_ASYNC object will have?

- actions: { STARTED, SUCCEEDED, FAILED }
- dispatchers: { started(), succeeded(payload), failed(error) }

### Actions

Actions contains the constant you gave with additional string at the end, according to the type needed(STARTED, SUCCEEDED, FAILED).
For example, in my reducer where I have the users, I will set my users to payload received only when the action has succeeded.

```javascript
// reducer.js
import { GET_USERS_ASYNC } from './actions';

const users = (users = [], action) => {
  if (action.type === GET_USERS_ASYNC.actions.SUCCEEDED) {
    return action.payload;
  }
  return users;
};
export const GET_USERS_ASYNC = asyncActionHelper(GET_USERS);
```

### Dispatchers

Dispatchers contains functions according to the type needed ( started(), succeeded(payload), failed(error) ).
I use redux saga, so for example you can import GET_USERS_ASYNC in your saga.js file, where you can call the GET_USERS_ASYNC.dispatchers.started() when the async action begin.

```javascript
    // saga.js
    import { GET_USERS_ASYNC } from './actions';

    function* getUsersSaga(action) {
        try {
            yield put(GET_USERS_ASYNC.dispatchers.started());
```

If you don't use redux saga, call the dispatcher where you dispatch your action. Also, use all dispatchers were needed and for succeeded and failed functions, don't forget to give the parameter needed.
