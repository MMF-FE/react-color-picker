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
                onChange={(val) => {
                    console.log(val)
                }}
            ></Panel>
            <EyeDropper></EyeDropper>
        </div>
    )
}

export default React.memo(ColorPicker)
