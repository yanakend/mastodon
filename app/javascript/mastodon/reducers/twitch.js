import {
  TWITCH_CHANGE_SCREEN, 
  TWITCH_CLOSE_SCREEN,
  TWITCH_CHANNEL,
} from '../actions/twitch';
import { Map as ImmutableMap } from 'immutable';

const initialState = ImmutableMap({
  isFullscreen: false,
  isCloseScreen: localStorage.isCloseTwitchWindow == 'true' ? true : false,
  channel: "",
});

export default function twitch(state = initialState, action) {
  switch(action.type) {
  case TWITCH_CHANGE_SCREEN:
    return state.setIn(['isFullscreen'], action.status);
  case TWITCH_CLOSE_SCREEN:
    localStorage.isCloseTwitchWindow = action.status;
    return state.setIn(['isCloseScreen'], action.status);
  case TWITCH_CHANNEL:
    return state.setIn(['channel'], action.channel);
  default:
    return state;
  }
};
