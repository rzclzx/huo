export default {
    clone (obj) {
        if(!obj) return
        return JSON.parse(JSON.stringify(obj))
    },
    removeBlank (str) {
        if (typeof str !== 'string') return
        return str.replace(/(^\s*)|(\s*$)/g, '')
    },
    handleResponse(res,callbak){
        if (res.code === 'MGT00000') {
            if(callbak){
                callbak(res);
            }
        } else {
            const config = {
                title: this.$t('错误'),
                content: this.$t(`errorCode['${res.code}']`)
            };
            this.$Modal.error(config)
        }
    },
    objChildrenToString (obj) {
        if (typeof obj !== 'object') return
        for (let i in obj) {
            if (typeof obj[i] === 'number') {
                obj[i] = obj[i] + ''
            }
        }
        return obj
    }
}
