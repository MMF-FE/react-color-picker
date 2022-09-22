import React, { useMemo } from 'react'
import { Panel, PanelProps } from 'rc-color-picker'
import EyeDropper from '../EyeDropper'
import 'rc-color-picker/assets/index.css'
import classnames from 'classnames'

import styles from './style.module.css'

export interface ColorPickerProps extends PanelProps {}

const ColorPicker: React.FC<ColorPickerProps> = (props) => {
    const { width = 200 } = props

    return (
        <>
            <Panel
                {...props}
                style={{ ...props?.style, width }}
                className={classnames(styles.colorPicker, props.className)}
                onChange={(val) => {
                    props.onChange?.(val)
                }}
            ></Panel>
            <EyeDropper
                onPick={(val) => {
                    props.onChange?.({ color: val, alpha: props.alpha || 100 })
                }}
            ></EyeDropper>
        </>
    )
}

export default React.memo(ColorPicker)
