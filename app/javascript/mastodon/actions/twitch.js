export const TWITCH_LARGE_SCREEN = 'TWITCH_LARGE_SCREEN';
export const TWITCH_SMALL_SCREEN = 'TWITCH_SMALL_SCREEN';
export const TWITCH_CLOSE_SCREEN = 'TWITCH_CLOSE_SCREEN';

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

