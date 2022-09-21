import React, { useCallback } from 'react'
import styles from './style.module.css'

interface EyeDropperrops {
    onPick?: (color: string) => void
}

const EyeDropper: React.FC<EyeDropperrops> = (props) => {
    const { onPick } = props

    const openEyeDropper = useCallback(async () => {
        // @ts-ignore
        const EyeDropper = window.EyeDropper
        if (!EyeDropper) return

        const eyeDropper = new EyeDropper()
        const res = await eyeDropper.open()

        if (onPick) onPick(res.sRGBHex)
    }, [onPick])

    return (
        <div className={styles.eyeDropper} onClick={openEyeDropper}>
            <img
                src={
                    'https://lite-static.meimeifa.com/yz/15b91342400b1064b845a36535a6a495.svg'
                }
                alt=""
            />
        </div>
    )
}

export default React.memo(EyeDropper)
