<template>
    <div
        class="d-flex justify-content-start align-items-center mb-2 item__notify-request"
    >
        <img
            :src="request.group.group_image"
            class="mr-3"
            width="120"
            height="120"
            :alt="request.group.name"
        />
        <div class="noti-caption">
            <span class="noti-title text-light" v-if="nofifyFor == 'admin'">
                <strong class="name-sender">{{ request.sender.name }}</strong>
                Đã yêu cầu tham gia nhóm
                <strong>{{ request.group.name }}</strong> của bạn
            </span>
            <span
                class="noti-title text-light"
                v-if="status == 1 && nofifyFro == 'user'"
            >
                Yêu cầu tham gia nhóm
                <strong>{{ request.group.name }}</strong> của bạn đã được phê
                duyệt
            </span>
            <span
                class="noti-title text-light"
                v-if="status == 2 && nofifyFor == 'user'"
            >
                Yêu cầu tham gia nhóm
                <strong>{{ request.group.name }}</strong> của bạn đã bị từ chối
            </span>
            <div class="small text-grey" v-if="nofifyFor == 'admin'">
                {{ formatTime(request.created_at) }}
            </div>
        </div>
    </div>
</template>
<script>
import user from "../../mixin/user";
export default {
    props: ["request", "nofifyFor", "status"],
    mixins: [user],
};
</script>
<style lang="scss" scoped>
.noti-caption {
    font-size: 16px;
    flex: 1;
}
img {
    border-top-left-radius: 15px;
    border-bottom-left-radius: 15px;
    flex: 0 0 120px;
    max-width: 120px;
}
.item__notify-request {
    border-radius: 15px !important;
    background: #272727 !important;
}
</style>
