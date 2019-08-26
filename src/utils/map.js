let map = new AMap.Map('#app')

export const getPlugin = (pluginname,options) => {
    return new Promise((resolve) => {
        map.plugin(pluginname,() => {
            const Oplugins = new AMap[pluginname.split(".")[1]]({
                ...options
            })
            resolve(Oplugins)
        })
    })
}

