<template>
    <div class="item__notify-request">
        <notify-header></notify-header>
        <div class="d-flex mb-2 justify-content-center p-2 align-items-center">
            <img
                :src="request.newestGr.group_image"
                class="mr-3 img__obj--cover"
                width="120"
                height="120"
                :alt="request.newestGr.name"

            />
            <div class="noti-caption">
                <span class="dtnotify1">
                    <span
                        class="noti-title text-light"
                        v-if="nofifyFor == 'admin'"
                    >
                        <strong class="name-sender">{{
                            request.sender.name
                        }}</strong>
                        Đã yêu cầu tham gia nhóm
                        <strong>{{ request.newestGr.name }}</strong> của bạn
                    </span>
                    <span
                        class="noti-title"
                        v-if="status == 1 && nofifyFor == 'user'"
                    >
                        Yêu cầu tham gia nhóm
                        <strong>{{ request.newestGr.name }}</strong> của bạn đã
                        được phê duyệt
                    </span>
                    <span
                        class="noti-title"
                        v-if="status == 2 && nofifyFor == 'user'"
                    >
                        Yêu cầu tham gia nhóm
                        <strong>{{ request.newestGr.name }}</strong> của bạn đã
                        bị từ chối
                    </span>
                </span>
                <span
                    class="small text-grey request-time"
                    v-if="nofifyFor == 'admin'"
                >
                    {{ formatTime(request.created_at) }}
                </span>
            </div>
        </div>
    </div>
</template>
<script>
import user from "../../mixin/user";
import NotifyHeader from "../../components/ui/Notify/NotifyHeader.vue";
export default {
    props: ["request", "nofifyFor", "status"],
    mixins: [user],
    components: { NotifyHeader },
};
</script>
<style lang="scss" scoped>
.noti-caption {
    flex: 1;
}
.request-time {
    font-size: 14px;
    color: #e4e6eb;
}
img {
    border-radius: 50%;
    flex: 0 0 56px;
    max-width: 56px;
    height: 56px;
}
.dtnotify1 {
    font-size: 1rem;
    color: #e4e6eb;
    word-wrap: break-word;
    text-align: left;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    display: -webkit-box;
    line-height: 1.3333;
    font-weight: 400;
}
.item__notify-request {
    border-radius: 8px !important;
    background: #272727 !important;
}
</style>
