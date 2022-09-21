import React, { useState } from 'react'
import {
    AnglePicker,
    GradientPicker,
    GradientPickerProps,
} from 'react-linear-gradient-picker'
import 'react-linear-gradient-picker/'
import 'react-linear-gradient-picker/dist/index.css'
import ColorPicker from '../ColorPicker'

export interface GradientColorPickerProps extends GradientPickerProps {
    // 角度
    angle: number
    // 角度改变
    onAngleChange: (val: number) => void
}

export interface WrappedColorPickerProps {
    onSelect: (color: string, alpha: number) => void
}

const WrappedColorPicker: React.FC<WrappedColorPickerProps> = ({
    onSelect,
    ...rest
}) => {
    return (
        <ColorPicker
            {...rest}
            onChange={(val) => {
                onSelect(val.color, val.alpha / 100)
            }}
        />
    )
}

const GradientColorPicker: React.FC<GradientColorPickerProps> = (props) => {
    const { angle, onAngleChange, ...rest } = props

    return (
        <div>
            <GradientPicker {...props}>
                {/* @ts-ignore */}
                <WrappedColorPicker></WrappedColorPicker>
            </GradientPicker>
            <AnglePicker angle={angle} setAngle={onAngleChange}></AnglePicker>
        </div>
    )
}

export default React.memo(GradientColorPicker)
