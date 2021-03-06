import React, { useMemo, useState, useEffect } from 'react'
import { ColorPicker as _ColorPicker, toColor as _toColor, Color as _Color } from 'react-color-palette'
import type { ColorPickerProps } from 'react-color-palette/lib/interfaces/ColorPicker.interface'
import {
    GradientPicker as _GradientPicker,
    AnglePicker as _AnglePicker,
    getGradientPreview as _getGradientPreview,
    // @ts-ignore
} from 'react-linear-gradient-picker'
import style from './style.module.css'
import 'react-color-palette/lib/css/styles.css'
import 'react-linear-gradient-picker/dist/index.css'

export interface ColorVal {
    colors: string[]
    offsets: string[]
    angle: number
    background: string
    gradient: {
        x1: number
        x2: number
        y1: number
        y2: number
    }
}

export interface Color extends _Color {}

// 对外发布组件
export const ColorPicker = _ColorPicker
export const toColor = _toColor
export const GradientPicker = _GradientPicker
export const AnglePicker = _AnglePicker
export const getGradientPreview = _getGradientPreview
export interface Props
    extends Omit<
        ColorPickerProps,
        'onChange' | 'color' | 'onChangeComplete' | 'width'
    > {
    colors?: string[]
    offsets?: string[]
    angle?: number
    /**
     * 最多设置多少个通道
     * @default 2
     **/
    maxStops?: number

    /**
     * 宽度
     * @default 300
     */
    width?: number

    paletteHeight?: number

    onChange?: (v: ColorVal) => void
}

interface WrappedProps extends Omit<ColorPickerProps, 'color'> {
    color: string
    opacity?: number
    onSelect: (color: string, alpha: number) => void
}

const WrappedColorPicker: React.FC<WrappedProps> = React.memo(
    ({
        onSelect,
        width = 300,
        alpha = true,
        hideRGB = true,
        hideHSV = true,
        ...rest
    }) => {
        const inputColor = rest.color || '#2aaeff'

        const color = useMemo(() => {
            const c = _toColor(
                // @ts-ignore
                inputColor.startsWith('#') ? 'hex' : 'rgb',
                inputColor
            )
            // @ts-ignore
            return _toColor('rgb', {
                ...c.rgb,
                a: rest.opacity || c.rgb.a,
            })
        }, [inputColor, rest.opacity])

        return (
            <ColorPicker
                {...rest}
                alpha={alpha}
                hideRGB={hideRGB}
                hideHSV={hideHSV}
                width={width}
                color={color}
                onChange={(color) => {
                    onSelect(color.hex, color.rgb.a || 1)
                }}
            />
        )
    }
)

const Component: React.FC<Props> = (props) => {
    const {
        colors = ['#2aaeff'],
        offsets = ['0'],
        maxStops = 2,
        width = 300,
        paletteHeight = 20,
        onChange = () => {},
    } = props

    const [angle, setAngle] = useState(props.angle || 90)

    const inputColors = useMemo(() => {
        const list = colors
            .map((c, ix) => {
                if (ix >= maxStops) {
                    return null
                }
                return _toColor(
                    // @ts-ignore
                    c.startsWith('#') ? 'hex' : 'rgb',
                    c
                )
            })
            .filter((v) => v)

        return list as _Color[]
    }, [colors])

    const inputOffsets = useMemo(() => {
        const list = offsets
            .map((c, ix) => {
                if (ix >= maxStops) {
                    return null
                }
                return c
            })
            .filter((v) => v)

        return list as string[]
    }, [offsets])

    const inputPalette = useMemo(() => {
        return inputColors.map((c, ix) => {
            const offset = inputOffsets[ix] || '0'
            return {
                offset,
                color: c.hex,
                opacity: c.rgb.a || 1,
            }
        })
    }, [inputColors, inputOffsets])

    const [pickerColors, setPickerColors] = useState(inputColors)

    const [palette, setPalette] = useState(inputPalette)

    // 颜色改变处理
    useEffect(() => {
        if (maxStops === 1) {
            onChange({
                colors: pickerColors.map((v) => v.hex),
                offsets: ['0'],
                background: pickerColors[0].hex,
                angle,
                gradient: {
                    x1: 0,
                    x2: 1,
                    y1: 0,
                    y2: 0,
                },
            })
            return
        }

        try {
            const p = palette.map((v) => {
                const c = _toColor('hex', v.color)
                return {
                    ...v,
                    color: `rgba(${c.rgb.r},${c.rgb.g},${c.rgb.b},${
                        c.rgb.a || v.opacity || 1
                    })`,
                }
            })
            const res = getGradientPreview(p, angle)

            onChange({
                colors: palette.map((c) => c.color),
                offsets: palette.map((p) => p.offset),
                angle,
                background: res.background,
                gradient: res.gradient,
            })
        } catch (error) {
            console.log(error)
        }
    }, [palette, onChange, angle, maxStops, pickerColors])

    useEffect(() => {
        setPickerColors(inputColors)
        setPalette(inputPalette)
    }, [])

    if (maxStops === 1) {
        return (
            <ColorPicker
                {...props}
                width={width}
                onChange={(color) => setPickerColors([color])}
                color={pickerColors[0]}
            />
        )
    }

    return (
        <div
            style={{
                width,
            }}
        >
            <GradientPicker
                {...{
                    width: width,
                    paletteHeight,
                    palette,
                    maxStops,
                    angle,
                    setAngle,
                    showAnglePicker: true,
                    onPaletteChange: setPalette,
                }}
            >
                {/* @ts-ignore */}
                <WrappedColorPicker />
            </GradientPicker>
            <div className={style.angleHolder}>
                <AnglePicker size={32} angle={angle} setAngle={setAngle} />
                <div className={style.angleInputs}>
                    <span onClick={() => setAngle(angle - 1)}>&#8722;</span>
                    <input value={`${angle}°`} disabled />
                    <span onClick={() => setAngle(angle + 1)}>&#43;</span>
                </div>
            </div>
        </div>
    )
}

export default React.memo(Component)

