import React, { useState } from 'react'
import MyComponent from '../../src'

export default () => {
    const [background, setBackground] = useState('#ffffff')

    return (
        <>
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
        </>
    )
}
