import React, { useState } from 'react'
import { ColorPicker, GradientColorPicker, Color } from '../../src'

export default () => {
    const [background, setBackground] = useState('#ffffff')

    const [color, setColor] = useState<Color>()

    return (
        <div style={{ display: 'flex' }}>
            <div>
                <div
                    style={{
                        width: 120,
                        height: 30,
                        marginBottom: 50,
                        borderRadius: 5,
                        background,
                    }}
                ></div>
                <GradientColorPicker
                    palette={[
                        { color: 'rgb(255, 255, 255)', offset: 0 },
                        { color: 'rgb(0, 0, 0)', offset: 100 },
                    ]}
                    // colors={['#2aaeffa7', '#e600ef8f']}
                    // offsets={['0', '0.7']}
                    // angle={150}
                    // onChange={(res) => setBackground(res.background)}
                />
            </div>

            <div style={{ marginLeft: 50 }}>
                <div
                    style={{
                        width: 120,
                        height: 30,
                        marginBottom: 50,
                        borderRadius: 5,
                        // background: color.hex,
                    }}
                ></div>
                <ColorPicker
                    color={color}
                    onChange={(val) => {
                        setColor(val.rgb)
                    }}
                />
            </div>
        </div>
    )
}
