exports.asyncActionHelper = actionName =>
  typeof actionName !== 'string'
    ? new Error('Please provide a string to actionName!')
    : {
        actions: {
          STARTED: `${actionName}_STARTED`,
          SUCCEEDED: `${actionName}_SUCCEEDED`,
          FAILED: `${actionName}_FAILED`,
        },
        dispatchers: {
          started: () => ({ type: `${actionName}_STARTED` }),
          succeeded: payload => ({
            type: `${actionName}_SUCCEEDED`,
            payload: payload,
          }),
          failed: error => ({ type: `${actionName}_FAILED`, payload: error }),
        },
      };
