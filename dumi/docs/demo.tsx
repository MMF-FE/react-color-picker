import React, { useState } from 'react'
import MyComponent, { ColorPicker, toColor } from '../../src'

export default () => {
    const [background, setBackground] = useState('#ffffff')

    const [color, setColor] = useState(toColor('hex', '#af7e7e'))

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
                <MyComponent
                    colors={['#2aaeffa7', '#e600ef8f']}
                    offsets={['0', '0.7']}
                    angle={150}
                    onChange={(res) => setBackground(res.background)}
                />
            </div>

            <div style={{ marginLeft: 50 }}>
                <div
                    style={{
                        width: 120,
                        height: 30,
                        marginBottom: 50,
                        borderRadius: 5,
                        background: color.hex,
                    }}
                ></div>
                <ColorPicker width={300} color={color} onChange={setColor} />
            </div>
        </div>
    )
}
