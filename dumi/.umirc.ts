import path from 'path'
import fs from 'fs'
import fetch from 'node-fetch'
const docsType = 'react'
const nodeEnv = process.env.NODE_ENV
const ciToken = process.env.CI_TOKEN || ''
const pkgName = process.env.npm_package_name.replace('@', '')
const pkgVersion = process.env.npm_package_version || '1.0.0'
export const basePath = `/docs/${docsType}/${pkgName}/`
const cdnBase = `https://yz-cdn.meimeifa.com${basePath}`
export const distPath = path.resolve(path.join(__dirname, 'dist'))

const config = {
    base: nodeEnv === 'production' ? basePath : '/',
    publicPath: nodeEnv === 'production' ? cdnBase : '/',
    logo: 'https://yz-cdn.meimeifa.com/yzt/docs/React.png',
    title: process.env.npm_package_title,
    description: process.env.npm_package_description,
    hash: nodeEnv === 'production',
    chainWebpack(memo) {
        memo.plugins.delete('copy')
    },
    plugins: [
        path.join(__dirname, 'plugin.ts')
    ],
    // alias: {
    //     '@/': path.join(__dirname, '../src/'),
    // },
}

export default config

/**
 * 请求 api
 * @param {string} url
 * @param {object} data
 */
function api(url, data) {
    // const apiHost = 'http://127.0.0.1:7001/api'
    const apiHost = 'https://fe.yzone.co/api'
    return fetch(`${apiHost}${url}`, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
            token: ciToken
        },
        body: JSON.stringify(data)
    }).then(res => res.json())
}

/**
 * 更新文档
 * @param {string[]} pagePaths
 */
export async function updateDocs(pagePaths) {
    const reqDocs = {
        type: docsType,
        name: pkgName,
        version: pkgVersion,
        title: config.title,
        desc: config.description,
        logo: config.logo
    }

    const resDocs = await api('/v1/docs/', reqDocs)

    const docsId = resDocs.id

    const tasks = pagePaths.map(v => {
        return api('/v1/docs/html', {
            docsId,
            html: fs.readFileSync(v, 'utf8'),
            path: path.resolve(v).replace(distPath + '/', '')
        })
    })

    const resIds = await Promise.all(tasks)

    console.log(`同步文档成功，共 ${resIds.length} 个文件`)
}

