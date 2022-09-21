import React from 'react'
import { Panel, PanelProps } from 'rc-color-picker'
import EyeDropper from '../EyeDropper'
import 'rc-color-picker/assets/index.css'
import classnames from 'classnames'

import styles from './style.module.css'

export interface ColorPickerProps extends PanelProps {}

const ColorPicker: React.FC<ColorPickerProps> = (props) => {
    return (
        <div>
            <Panel
                {...props}
                onChange={(val) => {
                    props.onChange?.(val)
                }}
            ></Panel>
            <EyeDropper
                onPick={(val) => {
                    props.onChange?.({ color: val, alpha: 1 })
                }}
            ></EyeDropper>
        </div>
    )
}

export default React.memo(ColorPicker)
