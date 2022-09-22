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
    const [color, setColor] = useState({ color: '#555', alpha: 100 })

    const [palette, setPalette] = useState<PaletteColor[]>([
        { offset: 0, color: '#000' },
        { offset: 0.4, color: '#555' },
        { offset: 1, color: '#999' },
    ])

    const [angle, setAngle] = useState(0)

    const gradientPreview = useMemo(() => {
        return getGradientPreview(palette, angle)
    }, [palette, angle])

    const bgColor = useMemo(() => {
        return Color(color.color)
            .alpha(color.alpha / 100)
            .toString()
    }, [color])

    const renderBackground = (bg: string) => (
        <div
            style={{
                width: 120,
                height: 30,
                marginBottom: 50,
                borderRadius: 5,
                background: bg,
            }}
        ></div>
    )

    return (
        <div style={{ display: 'flex' }}>
            <div>
                {renderBackground(gradientPreview.background)}

                <GradientColorPicker
                    palette={palette}
                    onPaletteChange={setPalette}
                    angle={angle}
                    onAngleChange={setAngle}
                />
            </div>

            <div style={{ marginLeft: 50 }}>
                {renderBackground(bgColor)}
                <ColorPicker
                    color={color.color}
                    alpha={color.alpha}
                    onChange={setColor}
                />
            </div>
        </div>
    )
}
