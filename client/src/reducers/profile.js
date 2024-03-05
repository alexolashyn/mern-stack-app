const { GET_MY_PROFILE, MY_PROFILE_ERROR } = require('../actions/types');

const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {},
};

function profileReducer(state = initialState, action) {
  const { type, payload } = action;
  if (type === GET_MY_PROFILE) {
    return {
      ...state,
      profile: payload,
      loading: false,
    };
  }
  if (type === MY_PROFILE_ERROR) {
    return {
      ...state,
      error: payload,
      loading: false,
      profile: null,
    };
  }
  return state;
}

export default profileReducer;
