import React from 'react'
import {
    AnglePicker,
    GradientPicker,
    GradientPickerProps,
} from 'react-linear-gradient-picker'
import 'react-linear-gradient-picker/dist/index.css'
import ColorPicker from '../ColorPicker'

interface GradientColorPickerProps extends GradientPickerProps {}

const WrappedColorPicker = ({ onSelect, ...rest }) => {
    console.log('rest', rest)
    return (
        <ColorPicker
            {...rest}
            onChange={(val) => {
                console.log(val)
                onSelect(val.color, val.alpha / 100)
            }}
        />
    )
}

const GradientColorPicker: React.FC<GradientColorPickerProps> = (props) => {
    return (
        <div>
            <GradientPicker {...props}>
                <WrappedColorPicker></WrappedColorPicker>
                <AnglePicker></AnglePicker>
            </GradientPicker>
        </div>
    )
}

export default React.memo(GradientColorPicker)
