export const BLACKS_FILES = [
    /\.swf$/,
    /\.fla$/,
    /^\./
];

export const BLACKS_GENRES = BLACKS_FILES.concat(/\.d\/|\.d$/);

export const BLACKS_IMAGEMERGE = BLACKS_GENRES.concat(/\.g\/|\.g$/);
export const WHITES_IMAGEMERGE = [/\.png$/];

export const BLACKS_IMAGECOMPRESS = BLACKS_GENRES.concat();
export const WHITES_IMAGECOMPRESS = [/\.png$/, /.jpg$/, /.jpeg$/];
