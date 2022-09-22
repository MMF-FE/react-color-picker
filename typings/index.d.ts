declare module '*.css'

declare module 'rc-color-picker' {
    export interface Color {
        color: string
        alpha: number
    }
    export interface PanelProps {
        // 宽度
        width?: number
        // 透明度 默认值100
        alpha?: number
        // 样式类名
        className?: string
        // 颜色值 默认值#ff0000
        color?: string
        // 默认透明度 默认值100
        defaultAlpha?: number
        // 默认颜色值 默认值#ff0000
        defaultColor?: number
        // 是否显示透明度 默认值true
        enableAlpha?: boolean
        // 颜色模式 默认值RGB
        mode?: 'RGB' | 'HSL' | 'HSB'
        // 失去焦点时触发
        onBlur?: () => void
        // 颜色改变时触发
        onChange?: (color: Color) => void
        // 聚焦时触发
        onFocus?: () => void
        // 样式
        style?: React.CSSProperties
    }

    const Panel: React.FC<PanelProps>
}

declare module 'react-linear-gradient-picker' {
    import ColorClass from 'color'

    export interface PaletteColor {
        // 颜色
        color: string
        // 渐变偏移量
        offset: number
        // 透明度
        opacity?: number
        // 是否选中
        active?: boolean
    }

    export interface GradientPickerProps {
        // 渐变色数组
        palette: PaletteColor[]
        // 改变时触发
        onPaletteChange: (palette: PaletteColor[]) => void
        // 高度 默认值32
        paletteHeight?: number
        // 宽度 默认值400
        width?: number
        // 移除偏移量 默认值50
        stopRemovalDrop?: number
        // 最大渐变色数量 默认值5
        maxStops?: number
        // 最小渐变色数量 默认值2
        minStops?: number
    }

    export interface AnglePickerProps {
        // 角度
        angle: number
        // 修改角度
        setAngle: (angle: number) => void
        // 大小 默认值48
        size?: number
        // 变化幅度 默认值5
        snap?: number
    }

    const AnglePicker: React.FC<AnglePickerProps>

    const GradientPicker: React.FC<GradientPickerProps>

    const getGradientPreview: (
        palette: PaletteColor[],
        angle: number
    ) => {
        gradient: string
        background: string
        angle: string
    }

    const Color: ColorClass
}
