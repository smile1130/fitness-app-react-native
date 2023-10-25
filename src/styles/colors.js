export const mainColor = 'rgb(193, 0, 17)';
export const mainColorDark = 'rgb(154, 0, 14)';
export const mainColorLight = 'rgb(249, 229, 231)';

export const white = 'rgb(255, 255, 255)';
export const black = 'rgb(0, 0, 0)';

export const gray = 'rgb(132, 142, 156)';
export const gray2 = 'rgb(237, 239, 243)';
export const gray3 = 'rgb(192, 200, 213)';
export const darkGray = 'rgb(99, 106, 117)';

export const red = 'rgb(255, 105, 97)';
export const green = 'rgb(181, 228, 202)';
export const orange = 'rgb(255, 188, 153)';
export const blue = 'rgb(177, 229, 252)';

export const applyOpacity = (color, opacity) => {
    const rgbColor = color.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
    return rgbColor;
};