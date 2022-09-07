import 'react-color-palette/lib/css/styles.css'
import 'react-linear-gradient-picker/dist/index.css'
import React, { useMemo, useState, useEffect, useCallback } from 'react'
import {
    ColorPicker as _ColorPicker,
    toColor as _toColor,
    Color as _Color,
} from 'react-color-palette'
import type { ColorPickerProps } from 'react-color-palette/lib/interfaces/ColorPicker.interface'
import {
    GradientPicker as _GradientPicker,
    AnglePicker as _AnglePicker,
    getGradientPreview as _getGradientPreview,
    // @ts-ignore
} from 'react-linear-gradient-picker'
import style from './style.module.css'

const svgData =
    'PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjYyMDg1NTg3MjAyIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIwMDEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTgzMi44NTMzMzMgMTkxLjE0NjY2N2E2Ni45ODY2NjcgNjYuOTg2NjY3IDAgMCAwLTk1LjE0NjY2NiAwTDY3My43MDY2NjcgMjU2IDYyMi45MzMzMzMgMjAzLjk0NjY2N2E0Mi42NjY2NjcgNDIuNjY2NjY3IDAgMCAwLTYwLjE2IDAgNDIuNjY2NjY3IDQyLjY2NjY2NyAwIDAgMCAwIDYwLjE2bDI2LjQ1MzMzNCAyNi40NTMzMzMtMzIyLjEzMzMzNCAzMjIuMTMzMzMzTDI1NiA2ODYuNTA2NjY3bC02Ny40MTMzMzMgNjUuMjhhNTkuMzA2NjY3IDU5LjMwNjY2NyAwIDEgMCA4NS4zMzMzMzMgODUuMzMzMzMzbDY1LjI4LTY1LjI4IDczLjM4NjY2Ny0xMy4yMjY2NjcgMzIxLjcwNjY2Ni0zMjIuMTMzMzMzIDI2Ljg4IDI2LjQ1MzMzM2E0Mi42NjY2NjcgNDIuNjY2NjY3IDAgMCAwIDI5Ljg2NjY2NyAxMi4zNzMzMzQgNDIuNjY2NjY3IDQyLjY2NjY2NyAwIDAgMCAzMC4yOTMzMzMtMTIuMzczMzM0IDQyLjY2NjY2NyA0Mi42NjY2NjcgMCAwIDAgMC02MC4xNkw3NjggMzQ5Ljg2NjY2N2w2My41NzMzMzMtNjMuNTczMzM0YTY2Ljk4NjY2NyA2Ni45ODY2NjcgMCAwIDAgMS4yOC05NS4xNDY2NjZ6IG0tMzA1LjQ5MzMzMyAzODkuMTJIMzYwLjEwNjY2N2wyNTkuNDEzMzMzLTI1OS40MTMzMzQgODUuMzMzMzMzIDg1LjMzMzMzNHoiIHAtaWQ9IjIwMDIiPjwvcGF0aD48L3N2Zz4='

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

// @ts-ignore
const hasEyeDropper = window['EyeDropper'] !== undefined

let eyeDropper: any
if (hasEyeDropper) {
    // @ts-ignore
    eyeDropper = new EyeDropper()
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

        const openEyeDropper = useCallback(async () => {
            const res = await eyeDropper.open()
            onSelect(res.sRGBHex, 1)
        }, [eyeDropper, onSelect])

        return (
            <div
                style={{
                    position: 'relative',
                }}
            >
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
                {hasEyeDropper && (
                    <img
                        onClick={openEyeDropper}
                        style={{
                            position: 'absolute',
                            cursor: 'pointer',
                            height: 18,
                            right: 107,
                            bottom: 18,
                        }}
                        src={`data:image/svg+xml;base64,${svgData}`}
                        alt=""
                    />
                )}
            </div>
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

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const nextAngle = parseInt(event.target.value)

        if (nextAngle >= 0 && nextAngle <= 360) {
            setAngle(nextAngle)
        } else {
            setAngle(0)
        }
    }

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
                    <input
                        type="number"
                        value={angle}
                        onChange={handleInputChange}
                    />
                    <span onClick={() => setAngle(angle + 1)}>&#43;</span>
                </div>
            </div>
        </div>
    )
}

export default React.memo(Component)
