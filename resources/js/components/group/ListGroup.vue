<template>
    <div class="wrapper__list--group scroll-custom" id="wp__groups">
        <item-group
            v-for="(group, key) in listGroup"
            :key="'Lobby-Group-' + key"
            :group="group"
            :isLoading="!loadedGroups"
        ></item-group>
        <sk-item-group
            :isLoading="!loadedGroups"
            v-for="i in 7"
            :key="'Ske-Group-' + i"
        ></sk-item-group>
    </div>
</template>
<script>
import SkItemGroup from "../skeleton/SkItemGroup.vue";
import ItemGroup from "../group/ItemGroup.vue";
export default {
    components: {
        SkItemGroup,
        ItemGroup,
    },
    computed: {
        listGroup() {
            return this.$store.getters["users/groups"];
        },
        myGroups() {
            return this.$store.getters["users/myGroups"];
        },
    },
    async created() {
        await this.setGroups();
    },
    data() {
        return {
            loadedGroups: false,
        };
    },
    methods: {
        async setGroups() {
            await this.$store
                .dispatch("users/getGroups")
                .then((req) => {
                    this.loadedGroups = true;
                })
                .catch((err) => {
                    this.loadedGroups = false;
                });
        },
    },
};
</script>
<style lang="scss" scoped>
.wrapper__list--group {
    margin-bottom: 130px;
}
#wp__groups {
    overflow-x: hidden;
    overflow-y: scroll;
}
</style>
