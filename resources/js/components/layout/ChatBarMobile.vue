<template>
    <div class="cbm w-100">
        <div
            class="d-flex justify-content-between align-items-center"
            v-if="loaded"
        >
            <div
                class="cbm__info d-flex justify-content-start align-items-center"
            >
                <v-icon
                    dark
                    color="primary"
                    class="cursor-pointer"
                    @click="backHome"
                    >mdi-arrow-left</v-icon
                >
                <div class="cbm__info--user d-flex align-items-center ml-3">
                    <item-avatar
                        :fullWH="false"
                        width="30px"
                        height="30px"
                        :img="receiver.avatar"
                        v-if="typeChat == 0"
                        :username="receiver.name"
                    ></item-avatar>
                    <item-avatar
                        :fullWH="false"
                        width="30px"
                        height="30px"
                        :img="receiver.group_image"
                        v-else
                        :username="receiver.name"
                    ></item-avatar>
                    <span class="name text-overflow">{{ receiver.name }}</span>
                </div>
            </div>
            <div class="cbm__actions"></div>
        </div>
    </div>
</template>
<script>
import user from "../../mixin/user";
import routes from "../../mixin/routes";
export default {
    mixins: [user, routes],
    props: ["loaded", "typeChat"],
};
</script>
<style lang="scss" scoped>
.cbm {
    display: none;
    &__info {
        &--user {
            .name {
                font-size: 15px;
                margin-left: 10px;
            }
        }
    }
}
</style>
