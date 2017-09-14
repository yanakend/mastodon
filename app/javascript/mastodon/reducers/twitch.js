import {
  TWITCH_LARGE_SCREEN, 
  TWITCH_SMALL_SCREEN 
} from '../actions/twitch';
import { Map as ImmutableMap } from 'immutable';

const initialState = ImmutableMap({
  isFullscreen: false,
});

export default function twitch(state = initialState, action) {
  console.log(state);
  switch(action.type) {
  case TWITCH_LARGE_SCREEN:
    return state.setIn(['isFullscreen'], true);
  case TWITCH_SMALL_SCREEN:
    return state.setIn(['isFullscreen'], false);
  default:
    return state;
  }
};
