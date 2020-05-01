<template>
    <Tabs value="register">
        <TabPane label="注册登录统计" name="register">
            <RegisterAndLogin/>
        </TabPane>
    </Tabs>
</template>

<script>
    import RegisterAndLogin from './RegisterAndLogin'
    export default {
        name: "userInfoCount",
        components:{
            RegisterAndLogin
        }
    }
</script>

<style scoped>

</style>
