<template>
    <div class="package__msg">
        <div class="pb-4 chat-message-left mt-4">
            <div class="d-flex flex-column align-items-center mr-3">
                <img
                    :src="makeAvatar(getRcv('avatar'))"
                    class="rounded-circle mr-1"
                    :alt="getRcv()"
                    width="45"
                    height="45"
                />
            </div>
            <div
                class="flex-shrink-1 bg-light rounded mr-2 chat-item d-flex flex-column justify-content-center position-relative friend-chat"
                style="padding: 10px"
            >
                <div class="typing">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import user from "../../mixin/user";
export default {
    mixins: [user],
};
</script>
<style lang="scss" scoped>
.chat-bubble {
    background-color: #e6f8f1;
    padding: 16px 28px;
    -webkit-border-radius: 20px;
    -webkit-border-bottom-left-radius: 2px;
    -moz-border-radius: 20px;
    -moz-border-radius-bottomleft: 2px;
    border-radius: 20px;
    border-bottom-left-radius: 2px;
    display: inline-block;
}
.typing {
    align-items: center;
    display: flex;
    height: 17px;
}
.typing .dot {
    animation: mercuryTypingAnimation 1.8s infinite ease-in-out;
    background-color: #6cad96; //rgba(20,105,69,.7);
    border-radius: 50%;
    height: 7px;
    margin-right: 4px;
    vertical-align: middle;
    width: 7px;
    display: inline-block;
}
.typing .dot:nth-child(1) {
    animation-delay: 200ms;
}
.typing .dot:nth-child(2) {
    animation-delay: 300ms;
}
.typing .dot:nth-child(3) {
    animation-delay: 400ms;
}
.typing .dot:last-child {
    margin-right: 0;
}

@keyframes mercuryTypingAnimation {
    0% {
        transform: translateY(0px);
        background-color: #6cad96; // rgba(20,105,69,.7);
    }
    28% {
        transform: translateY(-7px);
        background-color: #9ecab9; //rgba(20,105,69,.4);
    }
    44% {
        transform: translateY(0px);
        background-color: #b5d9cb; //rgba(20,105,69,.2);
    }
}
</style>
