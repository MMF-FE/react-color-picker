import { IApi } from 'dumi'
import path from 'path'
import { distPath, updateDocs, basePath } from './.umirc'
import upqn from '@yzfe-private/upqn'


export default (api: IApi) => {
    let htmlFiles: string[] = []
    api.modifyExportRouteMap(async defaultRouteMap => {
        htmlFiles = defaultRouteMap.map(v => path.join(distPath, v.file))

        return defaultRouteMap
    })

    api.onBuildComplete(async ({ err, stats }) => {

        // 上传到 CDN
        try {
            const res = await upqn({
                dir: {
                    path: distPath,
                    prefix: basePath
                }
            })

            if (Array.isArray(res)) {
                console.log(`上传 ${res.length} 个文件到 CDN`)
            }
        } catch (error) {
            if (String(error).includes('!file exists')) {
                throw error
            }
        }
        // 将文档同步到 fe.yzone.co/docs/vue 下
        await updateDocs(htmlFiles)
    })
}
