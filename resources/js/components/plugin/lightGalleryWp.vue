<template lang="html">
    <div id="chatLg" class="d-none">
        <a
            :href="!isVid(file) ? file.url : ''"
            :index="index"
            :data-video="source(file)"
            v-for="(file, index) in list"
            :key="'gll-' + index"
            :id="'lg-item-' + index"
            class="gallery-item"
        >
            <img
                :src="
                    !isVid(file)
                        ? file.url
                        : 'https://png.pngtree.com/png-clipart/20190520/original/pngtree-play-video-graphic-icon-design-template-png-image_3762200.jpg'
                "
            />
        </a>
    </div>
</template>
<script>
export default {
    props: ["list"],
    methods: {
        isVid(file) {
            return file.type === 7;
        },
        source(file) {
            return this.isVid(file)
                ? '{"source": [{"src":"' +
                      file.url +
                      '", "type":"video/mp4"}], "attributes": {"preload": false, "controls": true}}'
                : "";
        },
    },
};
</script>
<style lang="scss"></style>
