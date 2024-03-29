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

import gradient from 'gradient-parser'
import style from './style.module.css'

export interface Gradient {
    x1: number
    x2: number
    y1: number
    y2: number
}

export interface ColorVal {
    colors: string[]
    offsets: string[]
    angle: number
    background: string
    gradient: Gradient
}

export interface Color extends _Color {}

// 对外发布组件
export const ColorPicker = (props: ColorPickerProps) => {
    const openEyeDropper = useCallback(async () => {
        const res = await eyeDropper.open()
        const nextColor = _toColor('hex', res.sRGBHex)
        props.onChange(nextColor)
    }, [eyeDropper, props.onChange])

    return (
        <div className={style.colorPicker}>
            <_ColorPicker {...props}></_ColorPicker>
            {hasEyeDropper && (
                <div
                    className={style.colorPickerDropper}
                    onClick={openEyeDropper}
                >
                    <img
                        src={
                            'https://lite-static.meimeifa.com/yz/15b91342400b1064b845a36535a6a495.svg'
                        }
                        alt=""
                    />
                </div>
            )}
        </div>
    )
}
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

const defaultGradient: Gradient = {
    x1: 0,
    x2: 1,
    y1: 0,
    y2: 0,
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
                className={`${style.multipleColorPicker} ${
                    hasEyeDropper ? style.hasEyeDropper : ''
                }`}
            >
                <_ColorPicker
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
                    <div className={style.eyeDropper} onClick={openEyeDropper}>
                        <img
                            src={
                                'https://lite-static.meimeifa.com/yz/15b91342400b1064b845a36535a6a495.svg'
                            }
                            alt=""
                        />
                    </div>
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

    // 是否编辑
    const [edit, setEdit] = useState(false)

    const [angle, setAngle] = useState(props.angle || 90)
    const [textarea, setTextarea] = useState('')

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

    const gradientRes = useMemo(() => {
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

            return res as {
                background: string
                gradient: Gradient
            }
        } catch (err) {
            console.log('try.catch.getGradientPreview.err: ', err)
        }
    }, [palette, angle])

    const handleAngleInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const nextAngle = parseInt(event.target.value)

        if (nextAngle >= 0 && nextAngle <= 360) {
            setAngle(nextAngle)
        } else {
            setAngle(0)
        }
    }

    const handleCopy = () => {
        const el = document.getElementById('gradient-textarea')
        // @ts-ignore
        el.select()
        document.execCommand('copy')
    }

    const handleEdit = useCallback(() => {
        setEdit(true)
        setTextarea(gradientRes?.background || '')
    }, [gradientRes?.background])

    const handleCancel = () => {
        setEdit(false)
    }

    const handleSave = useCallback(() => {
        const res = gradient.parse(textarea)[0]
        // @ts-ignore
        setAngle(Math.floor(res?.orientation?.value || 0))

        setPalette(
            res.colorStops.map((v) => {
                const c = _toColor('rgb', {
                    r: Number(v.value[0]),
                    g: Number(v.value[1]),
                    b: Number(v.value[2]),
                    a: Number(v.value[3]),
                })
                return {
                    offset: String(Number(v?.length?.value || 0) / 100) || '0',
                    color: c.hex,
                    opacity: Number(Number(v.value[3] || 0).toFixed(1)),
                }
            })
        )
        setEdit(false)
    }, [textarea])

    // 颜色改变处理
    useEffect(() => {
        if (maxStops === 1) {
            onChange({
                colors: pickerColors.map((v) => v.hex),
                offsets: ['0'],
                background: pickerColors[0].hex,
                angle,
                gradient: defaultGradient,
            })
            return
        }

        onChange({
            colors: palette.map((c) => c.color),
            offsets: palette.map((p) => p.offset),
            angle,
            background: gradientRes?.background || '',
            gradient: gradientRes?.gradient || defaultGradient,
        })
    }, [palette, onChange, angle, maxStops, pickerColors, gradientRes])

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
            className={style.multipleColorPickerLayout}
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
                <AnglePicker size={40} angle={angle} setAngle={setAngle} />
                <div className={style.angleInputs}>
                    <span onClick={() => setAngle(angle - 1)}>&#8722;</span>
                    <input
                        type="number"
                        value={angle}
                        onChange={handleAngleInputChange}
                    />
                    <span onClick={() => setAngle(angle + 1)}>&#43;</span>
                </div>
            </div>

            <div className={style.textarea}>
                <textarea
                    id="gradient-textarea"
                    readOnly={!edit}
                    value={edit ? textarea : gradientRes?.background}
                    onChange={(e) => setTextarea(e.target.value)}
                ></textarea>
            </div>

            {!edit && (
                <div className={style.actions}>
                    <div className={style.item} onClick={handleCopy}>
                        <img
                            className={style.icon}
                            style={{ width: 19, height: 19 }}
                            src="https://lite-static.meimeifa.com/yz/ba092573635f1a7f4f963403c33fbd7b.svg"
                            alt=""
                        />
                        复制样式
                    </div>
                    <div className={style.line}></div>
                    <div className={style.item} onClick={handleEdit}>
                        <img
                            className={style.icon}
                            style={{ width: 18, height: 18 }}
                            src="https://lite-static.meimeifa.com/yz/ef8af42ecf712c1669fb169501988a99.svg"
                            alt=""
                        />
                        编辑样式
                    </div>
                </div>
            )}
            {edit && (
                <div className={style.actions}>
                    <div className={style.btn} onClick={handleCancel}>
                        取消
                    </div>
                    <div className={style.line} style={{ opacity: 0 }}></div>
                    <div
                        className={`${style.btn} ${style.active}`}
                        onClick={handleSave}
                    >
                        保存
                    </div>
                </div>
            )}
        </div>
    )
}

export default React.memo(Component)
