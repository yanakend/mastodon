import api, { getLinks } from '../api';

export const TWITCH_LARGE_SCREEN = 'TWITCH_LARGE_SCREEN';
export const TWITCH_SMALL_SCREEN = 'TWITCH_SMALL_SCREEN';
export const TWITCH_CLOSE_SCREEN = 'TWITCH_CLOSE_SCREEN';
export const TWITCH_CHANNEL = 'TWITCH_CHANNEL';

export function twitchFullscreen() {
  return {
    type: TWITCH_LARGE_SCREEN,
  };
};

export function twitchMiniscreen() {
  return {
    type: TWITCH_SMALL_SCREEN,
  };
};

export function twitchCloseScreen(status) {
  return {
    type: TWITCH_CLOSE_SCREEN,
    status: status,
  };
};

export function fetchTwitchSuccessSelector(data) {
  return {
    type: TWITCH_CHANNEL,
    channel: data.channel_name,
  };
};

export function fetchTwitchSelector() {
  return (dispatch, getState) => {
    const twitchId = getState().getIn(['twitch', 'channel']);

    if (twitchId !== '') {
      return;
    }

    api(getState).get(`/api/v1/twitch`).then(response => {
      dispatch(fetchTwitchSuccessSelector(response.data));
    }).catch(error => console.log('a'));
  };
;
};

