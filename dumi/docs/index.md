## react-color-picker

颜色选择器，支持多通道

## 安装

```sh
yarn add @yzfe/react-color-picker
```

## 演示

<code src="./demo.tsx"></code>

<API src="../../src/index.tsx"></API>

### ColorVal

```ts
interface ColorVal {
    colors: string[]
    offsets: string[]
    angle: number
    background: string
    gradient: {
        x1: number
        x2: number
        y1: number
        y2: number
    }
}
```
