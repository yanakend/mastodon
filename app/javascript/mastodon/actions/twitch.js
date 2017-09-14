export const TWITCH_LARGE_SCREEN = 'TWITCH_LARGE_SCREEN';
export const TWITCH_SMALL_SCREEN = 'TWITCH_SMALL_SCREEN';

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

