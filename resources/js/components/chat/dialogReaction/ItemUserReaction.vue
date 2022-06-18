<template>
    <div class="user__reaction d-flex justify-content-between align-center">
        <div class="user__reaction--avatar">
            <img
                src="https://res.cloudinary.com/team151/image/upload/v1655184458/user-1/x9zepj9jtvjxjue9ewvu.jpg"
                class="rounded-cricle img__obj--cover"
                alt=""
            />
        </div>
        <div class="user__reaction--cap">
            <span class="name"></span>
            <span class="note">Nhấp để gỡ</span>
        </div>
        <div class="user__reaction--icon"></div>
    </div>
</template>
<script>
import user from "../../../mixin/user";
export default {
    props: ["data"],
};
</script>
<style lang="scss" scoped>
.user__reaction {
    padding: 5px;
    border-radius: 8px;
    margin: 0 5px;
}
</style>
