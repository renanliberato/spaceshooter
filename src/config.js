export const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export const API_BASE_URL = 'https://localhost:5001';
//export const API_BASE_URL = 'https://renanliberato-spaceshooterserver.azurewebsites.net';

export const maxViewHeight = isMobile ? '100%' : window.innerHeight;
export const maxViewWidth = isMobile ? '100%' : maxViewHeight * 9 / 16;

export const UI_BASE_URL = '/';
//export const UI_BASE_URL = '/spaceshooter';