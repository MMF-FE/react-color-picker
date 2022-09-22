import React, { useState } from 'react'
import { useMemo } from 'react'
import {
    ColorPicker,
    GradientColorPicker,
    PaletteColor,
    getGradientPreview,
    Color,
} from '../../src'

export default () => {
    const [color, setColor] = useState('rgba(255, 0, 0, 1)')

    const [palette, setPalette] = useState<PaletteColor[]>([
        { offset: 0, color: '#000' },
        { offset: 0.4, color: '#555' },
        { offset: 1, color: '#999' },
    ])

    const [angle, setAngle] = useState(0)

    const gradientPreview = useMemo(() => {
        return getGradientPreview(palette, angle)
    }, [palette, angle])

    return (
        <div style={{ display: 'flex' }}>
            <div>
                <div
                    style={{
                        width: 120,
                        height: 30,
                        marginBottom: 50,
                        borderRadius: 5,
                        background: gradientPreview.background,
                    }}
                ></div>
                <GradientColorPicker
                    palette={palette}
                    onPaletteChange={(val) => {
                        setPalette(val)
                    }}
                    angle={angle}
                    onAngleChange={setAngle}
                />
            </div>

            <div style={{ marginLeft: 50 }}>
                <div
                    style={{
                        width: 120,
                        height: 30,
                        marginBottom: 50,
                        borderRadius: 5,
                        background: color,
                    }}
                ></div>
                <ColorPicker
                    color={color}
                    onChange={(val) => {
                        const nextColor = Color(val.color)
                            .alpha(val.alpha / 100)
                            .string()
                        setColor(nextColor)
                    }}
                />
            </div>
        </div>
    )
}
