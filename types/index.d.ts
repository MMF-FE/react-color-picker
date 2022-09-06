import 'react-color-palette/lib/css/styles.css';
import 'react-linear-gradient-picker/dist/index.css';
import React from 'react';
import { toColor as _toColor, Color as _Color } from 'react-color-palette';
import type { ColorPickerProps } from 'react-color-palette/lib/interfaces/ColorPicker.interface';
export interface ColorVal {
    colors: string[];
    offsets: string[];
    angle: number;
    background: string;
    gradient: {
        x1: number;
        x2: number;
        y1: number;
        y2: number;
    };
}
export interface Color extends _Color {
}
export declare const ColorPicker: ({ width, height, color, onChange, onChangeComplete, hideHEX, hideRGB, hideHSV, alpha, dark, }: ColorPickerProps) => JSX.Element;
export declare const toColor: typeof _toColor;
export declare const GradientPicker: any;
export declare const AnglePicker: any;
export declare const getGradientPreview: any;
export interface Props extends Omit<ColorPickerProps, 'onChange' | 'color' | 'onChangeComplete' | 'width'> {
    colors?: string[];
    offsets?: string[];
    angle?: number;
    /**
     * 最多设置多少个通道
     * @default 2
     **/
    maxStops?: number;
    /**
     * 宽度
     * @default 300
     */
    width?: number;
    paletteHeight?: number;
    onChange?: (v: ColorVal) => void;
}
declare const _default: React.NamedExoticComponent<Props>;
export default _default;
