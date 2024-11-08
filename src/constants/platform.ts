'use client';

const { NEXT_PUBLIC_APP_ENV } = process.env;

export const portkeyDidUIPrefix = '@portkey/did-ui-sdk:';

export const LOGIN_EARGLY_KEY = 'discover.loginEargly';

export const KEY_NAME = 'BEAN_GO_TOWN';

export const MAX_LEADERBOARD_ITEMS = 99;
export const MAX_LEADERBOARD_EMPTY = 6;
export const MAX_GAME_RECORD_ITEMS = 150;

export const PORTKEY_LOGIN_CHAIN_ID_KEY = 'portkeyLoginChainId';

export const TELEGRAM_TESTNET_BOT_ID = '6495817430';
export const TELEGRAM_MAINNET_BOT_ID = '6794091084';

export const TELEGRAM_BOT_ID = NEXT_PUBLIC_APP_ENV === 'test' ? TELEGRAM_TESTNET_BOT_ID : TELEGRAM_MAINNET_BOT_ID;
