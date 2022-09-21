import React, { useCallback, useMemo, useState } from 'react'
import {
    AnglePicker,
    getGradientPreview,
    GradientPicker,
    GradientPickerProps,
} from 'react-linear-gradient-picker'
import 'react-linear-gradient-picker/'
import 'react-linear-gradient-picker/dist/index.css'
import ColorPicker from '../ColorPicker'
import gradient from 'gradient-parser'
import Color from 'color'
import styles from './style.module.css'

export interface GradientColorPickerProps extends GradientPickerProps {
    // 角度
    angle: number
    // 角度改变
    onAngleChange: (val: number) => void
}

export interface WrappedColorPickerProps {
    color: string
    opacity?: number
    onSelect: (color: string, alpha: number) => void
}

const WrappedColorPicker: React.FC<WrappedColorPickerProps> = (props) => {
    const alpha = useMemo(() => {
        const color = Color(props.color)

        if (props.opacity) {
            return props.opacity * 100
        }

        return color.alpha() * 100
    }, [props.color, props.opacity])

    return (
        <ColorPicker
            color={props.color}
            alpha={alpha}
            onChange={(val) => {
                props.onSelect(val.color, val.alpha / 100)
            }}
        />
    )
}

const GradientColorPicker: React.FC<GradientColorPickerProps> = (props) => {
    const { palette, angle, onAngleChange, onPaletteChange } = props

    const [edit, setEdit] = useState(false)

    const [textarea, setTextarea] = useState('')

    const gradientPreview = useMemo(() => {
        return getGradientPreview(palette, angle)
    }, [palette, angle])

    const handleCopy = () => {
        const el = document.getElementById('gradient-textarea')
        // @ts-ignore
        el.select()
        document.execCommand('copy')
    }

    const handleEdit = useCallback(() => {
        setEdit(true)
        setTextarea(gradientPreview.background || '')
    }, [gradientPreview.background])

    const handleCancel = () => {
        setEdit(false)
    }

    const handleSave = useCallback(() => {
        const res = gradient.parse(textarea)[0]

        // @ts-ignore
        onAngleChange(Number(res?.orientation?.value || 0))
        onPaletteChange(
            res.colorStops.map((v) => {
                const offset = Number(v?.length?.value || 0) / 100

                const alpha =
                    Array.isArray(v.value) && v.value.length === 4
                        ? Number(v.value[3])
                        : 1

                const rgb = Array.isArray(v.value)
                    ? v.value?.map((val) => Number(val || 0))
                    : []

                return {
                    color: Color.rgb(rgb).alpha(alpha).string(),
                    offset: offset,
                }
            })
        )

        setEdit(false)
    }, [textarea])

    return (
        <div>
            <GradientPicker {...props}>
                {/* @ts-ignore */}
                <WrappedColorPicker></WrappedColorPicker>
            </GradientPicker>
            <AnglePicker angle={angle} setAngle={onAngleChange}></AnglePicker>

            <div className={styles.textarea}>
                <textarea
                    id="gradient-textarea"
                    readOnly={!edit}
                    value={edit ? textarea : gradientPreview.background}
                    onChange={(e) => setTextarea(e.target.value)}
                ></textarea>
            </div>

            {!edit && (
                <div className={styles.actions}>
                    <div className={styles.item} onClick={handleCopy}>
                        <img
                            className={styles.icon}
                            style={{ width: 19, height: 19 }}
                            src="https://lite-static.meimeifa.com/yz/ba092573635f1a7f4f963403c33fbd7b.svg"
                            alt=""
                        />
                        复制样式
                    </div>
                    <div className={styles.line}></div>
                    <div className={styles.item} onClick={handleEdit}>
                        <img
                            className={styles.icon}
                            style={{ width: 18, height: 18 }}
                            src="https://lite-static.meimeifa.com/yz/ef8af42ecf712c1669fb169501988a99.svg"
                            alt=""
                        />
                        编辑样式
                    </div>
                </div>
            )}
            {edit && (
                <div className={styles.actions}>
                    <div className={styles.btn} onClick={handleCancel}>
                        取消
                    </div>
                    <div className={styles.line} style={{ opacity: 0 }}></div>
                    <div
                        className={`${styles.btn} ${styles.active}`}
                        onClick={handleSave}
                    >
                        保存
                    </div>
                </div>
            )}
        </div>
    )
}

export default React.memo(GradientColorPicker)
