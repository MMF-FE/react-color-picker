import React from 'react';
import type { ColorPickerProps } from 'react-color-palette/lib/interfaces/ColorPicker.interface';
import 'react-color-palette/lib/css/styles.css';
import 'react-linear-gradient-picker/dist/index.css';
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
