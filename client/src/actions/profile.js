import axios from 'axios';
import { setAlert } from './alerts';
import { GET_MY_PROFILE, MY_PROFILE_ERROR } from './types';

export const getMyProfile = () => async (dispatch) => {
  try {
    const res = await axios.get('api/profiles/me');

    dispatch({
      type: GET_MY_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: MY_PROFILE_ERROR,
      payload: { msg: err.response.data.message, status: err.response.status },
    });
  }
};
