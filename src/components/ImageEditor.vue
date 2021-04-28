<template>
  <button @click="zoom">zoom</button>
  <img :src="imgSrc" />
  <!-- <div>
    <button @click="imgSrc ="$refs.editor.saveImage()">הצג</button>
    {{ mode }}
    <Dropdown
      :id="modes.id"
      v-model="mode"
      :options="modes"
      optionLabel="lbl"
      optionValue="id"
      @change="$refs.editor.set(mode)"
    ></Dropdown>
  </div> -->
  <div class="editorComponent">
    <div class="p-d-flex p-flex-column p-jc-center">
       <div class="stroke-width-value"> {{ strokeWidth }}</div>
      <div class="textWidth">
        <Slider
          v-model="strokeWidth"
          :min="1"
          :max="30"
          @change="changeStrokeWidth"
          orientation="vertical"
        />
      </div>
      <div class="colors">
        <div
          v-for="color in colors"
          :key="color"
          class="color-container"
          :style="{ 'background-color': color }"
          @click="changeColor(color)"
        ></div>
      </div>
    </div>
    <div class="editor-container">
      <div class="editor">
        <div
          class="tool current-color"
          :style="{ 'background-color': activeColor }"
        ></div>
        <div
          class="tool undo"
          @click="undo"
          :class="mode == 'undo' ? 'active-tool' : ''"
        >
          <svg
            class="svg-inline--fa fa-undo-alt fa-w-16 fa-lg"
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="undo-alt"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            data-fa-i2svg=""
          >
            <path
              fill="currentColor"
              d="M255.545 8c-66.269.119-126.438 26.233-170.86 68.685L48.971 40.971C33.851 25.851 8 36.559 8 57.941V192c0 13.255 10.745 24 24 24h134.059c21.382 0 32.09-25.851 16.971-40.971l-41.75-41.75c30.864-28.899 70.801-44.907 113.23-45.273 92.398-.798 170.283 73.977 169.484 169.442C423.236 348.009 349.816 424 256 424c-41.127 0-79.997-14.678-110.63-41.556-4.743-4.161-11.906-3.908-16.368.553L89.34 422.659c-4.872 4.872-4.631 12.815.482 17.433C133.798 479.813 192.074 504 256 504c136.966 0 247.999-111.033 248-247.998C504.001 119.193 392.354 7.755 255.545 8z"
            ></path></svg
          ><!-- <i class="fas fa-undo-alt fa-lg"></i> -->
        </div>
        <div
          class="tool redo"
          @click="redo"
          :class="mode == 'redo' ? 'active-tool' : ''"
        >
          <svg
            class="svg-inline--fa fa-redo-alt fa-w-16 fa-lg"
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="redo-alt"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            data-fa-i2svg=""
          >
            <path
              fill="currentColor"
              d="M256.455 8c66.269.119 126.437 26.233 170.859 68.685l35.715-35.715C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.75c-30.864-28.899-70.801-44.907-113.23-45.273-92.398-.798-170.283 73.977-169.484 169.442C88.764 348.009 162.184 424 256 424c41.127 0 79.997-14.678 110.629-41.556 4.743-4.161 11.906-3.908 16.368.553l39.662 39.662c4.872 4.872 4.631 12.815-.482 17.433C378.202 479.813 319.926 504 256 504 119.034 504 8.001 392.967 8 256.002 7.999 119.193 119.646 7.755 256.455 8z"
            ></path></svg
          ><!-- <i class="fas fa-redo-alt fa-lg"></i> -->
        </div>
        <div
          class="tool clear"
          @click="clear"
          :class="mode == 'clear' ? 'active-tool' : ''"
        >
          <svg
            class="svg-inline--fa fa-trash-alt fa-w-14 fa-lg"
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="trash-alt"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            data-fa-i2svg=""
          >
            <path
              fill="currentColor"
              d="M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"
            ></path></svg
          ><!-- <i class="fas fa-trash-alt fa-lg"></i> -->
        </div>
        <div
          class="tool free-drawing"
          @click="setMode('freeDrawing')"
          :class="mode == 'freeDrawing' ? 'active-tool' : ''"
        >
          <svg
            class="svg-inline--fa fa-pencil-alt fa-w-16 fa-lg"
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="pencil-alt"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            data-fa-i2svg=""
          >
            <path
              fill="currentColor"
              d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"
            ></path></svg
          ><!-- <i class="fas fa-pencil-alt fa-lg"></i> -->
        </div>
        <div
          class="tool add-text"
          @click="setMode('text')"
          :class="mode == 'text' ? 'active-tool' : ''"
        >
          <svg
            class="svg-inline--fa fa-font fa-w-14 fa-lg"
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="font"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            data-fa-i2svg=""
          >
            <path
              fill="currentColor"
              d="M432 416h-23.41L277.88 53.69A32 32 0 0 0 247.58 32h-47.16a32 32 0 0 0-30.3 21.69L39.41 416H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16h-19.58l23.3-64h152.56l23.3 64H304a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM176.85 272L224 142.51 271.15 272z"
            ></path></svg
          ><!-- <i class="fas fa-font fa-lg"></i> -->
        </div>
        <div
          class="tool zoom-and-move"
          @click="setMode('zoom')"
          :class="mode === 'zoom' ? 'active-tool' : ''"
        >
          <!-- <p>{{mode}}</p> -->
          <svg
            style="width: 1.5rem"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            version="1.1"
            viewBox="0 0 512 512"
            enable-background="new 0 0 512 512"
          >
            <g>
              <g>
                <path
                  d="m289.8,200.2h-49.3v-49.3c0-11.3-9.1-20.4-20.4-20.4-11.3,0-20.4,9.1-20.4,20.4v49.3h-49.3c-11.3,0-20.4,9.1-20.4,20.4 0,11.3 9.1,20.4 20.4,20.4h49.3v49.3c0,11.3 9.1,20.4 20.4,20.4 11.3,0 20.4-9.1 20.4-20.4v-49.3h49.3c11.3,0 20.4-9.1 20.4-20.4 0-11.3-9.2-20.4-20.4-20.4z"
                />
                <path
                  d="m220.2,388.7c-92.9,0-168.2-75.2-168.2-168.1s75.3-168.1 168.2-168.1 168.1,75.3 168.1,168.1-75.3,168.1-168.1,168.1zm274.8,78l-113.3-113.3c29.7-36.1 47.6-82.4 47.6-132.8 0-115.5-93.6-209.2-209.2-209.2s-209.1,93.7-209.1,209.2 93.6,209.2 209.2,209.2c50.4,0 96.6-17.8 132.7-47.5l113.3,113.3c5.2,5.3 21.1,7.9 28.9,0 7.9-8 7.9-20.9-0.1-28.9z"
                />
              </g>
            </g>
          </svg>
        </div>
        <div
          class="tool custom-circle"
          @click="setMode('circle')"
          :class="mode == 'circle' ? 'active-tool' : ''"
        >
          <svg
            class="svg-inline--fa fa-circle fa-w-16 fa-lg"
            aria-hidden="true"
            focusable="false"
            data-prefix="far"
            data-icon="circle"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            data-fa-i2svg=""
          >
            <path
              fill="currentColor"
              d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z"
            ></path></svg
          ><!-- <i class="far fa-circle fa-lg"></i> -->
        </div>
        <div
          class="tool custom-rect"
          @click="setMode('rect')"
          :class="mode == 'rect' ? 'active-tool' : ''"
        >
          <svg
            class="svg-inline--fa fa-square fa-w-14 fa-lg"
            aria-hidden="true"
            focusable="false"
            data-prefix="far"
            data-icon="square"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            data-fa-i2svg=""
          >
            <path
              fill="currentColor"
              d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6 400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"
            ></path></svg
          ><!-- <i class="far fa-square fa-lg"></i> -->
        </div>
        <div
          class="tool arrow"
          @click="setMode('arrow')"
          :class="mode == 'arrow' ? 'active-tool' : ''"
        >
          <svg
            class="svg-inline--fa fa-long-arrow-alt-down fa-w-8 fa-lg"
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="long-arrow-alt-down"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 512"
            data-fa-i2svg=""
          >
            <path
              fill="currentColor"
              d="M168 345.941V44c0-6.627-5.373-12-12-12h-56c-6.627 0-12 5.373-12 12v301.941H41.941c-21.382 0-32.09 25.851-16.971 40.971l86.059 86.059c9.373 9.373 24.569 9.373 33.941 0l86.059-86.059c15.119-15.119 4.411-40.971-16.971-40.971H168z"
            ></path></svg
          ><!-- <i class="fas fa-long-arrow-alt-down fa-lg"></i> -->
        </div>
        <div
          class="tool drag"
          @click="setMode('selectMode')"
          :class="mode == 'selectMode' ? 'active-tool' : ''"
        >
          <svg
            class="svg-inline--fa fa-arrows-alt fa-w-16 fa-lg"
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="arrows-alt"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            data-fa-i2svg=""
          >
            <path
              fill="currentColor"
              d="M352.201 425.775l-79.196 79.196c-9.373 9.373-24.568 9.373-33.941 0l-79.196-79.196c-15.119-15.119-4.411-40.971 16.971-40.97h51.162L228 284H127.196v51.162c0 21.382-25.851 32.09-40.971 16.971L7.029 272.937c-9.373-9.373-9.373-24.569 0-33.941L86.225 159.8c15.119-15.119 40.971-4.411 40.971 16.971V228H228V127.196h-51.23c-21.382 0-32.09-25.851-16.971-40.971l79.196-79.196c9.373-9.373 24.568-9.373 33.941 0l79.196 79.196c15.119 15.119 4.411 40.971-16.971 40.971h-51.162V228h100.804v-51.162c0-21.382 25.851-32.09 40.97-16.971l79.196 79.196c9.373 9.373 9.373 24.569 0 33.941L425.773 352.2c-15.119 15.119-40.971 4.411-40.97-16.971V284H284v100.804h51.23c21.382 0 32.09 25.851 16.971 40.971z"
            ></path></svg
          ><!-- <i class="fas fa-arrows-alt fa-lg"></i> -->
        </div>
        <div
          class="tool crop-apply active-tool"
          v-if="mode == 'crop'"
          @click="applyCropping"
        >
          <svg
            class="svg-inline--fa fa-check-circle fa-w-16 fa-lg"
            aria-hidden="true"
            focusable="false"
            data-prefix="far"
            data-icon="check-circle"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            data-fa-i2svg=""
          >
            <path
              fill="currentColor"
              d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z"
            ></path></svg
          ><!-- <i class="far fa-check-circle fa-lg"></i> -->
        </div>
        <div class="tool crop" @click="setMode('crop')" v-if="mode != 'crop'">
          <svg
            class="svg-inline--fa fa-crop-alt fa-w-16 fa-lg"
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="crop-alt"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            data-fa-i2svg=""
          >
            <path
              fill="currentColor"
              d="M488 352h-40V96c0-17.67-14.33-32-32-32H192v96h160v328c0 13.25 10.75 24 24 24h48c13.25 0 24-10.75 24-24v-40h40c13.25 0 24-10.75 24-24v-48c0-13.26-10.75-24-24-24zM160 24c0-13.26-10.75-24-24-24H88C74.75 0 64 10.74 64 24v40H24C10.75 64 0 74.74 0 88v48c0 13.25 10.75 24 24 24h40v256c0 17.67 14.33 32 32 32h224v-96H160V24z"
            ></path></svg
          ><!-- <i class="fas fa-crop-alt fa-lg"></i> -->
        </div>
        <div class="tool upload-image">
          <label for="chooseImage"
            ><svg
              class="svg-inline--fa fa-file-upload fa-w-12 fa-lg"
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="file-upload"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              data-fa-i2svg=""
            >
              <path
                fill="currentColor"
                d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm65.18 216.01H224v80c0 8.84-7.16 16-16 16h-32c-8.84 0-16-7.16-16-16v-80H94.82c-14.28 0-21.41-17.29-11.27-27.36l96.42-95.7c6.65-6.61 17.39-6.61 24.04 0l96.42 95.7c10.15 10.07 3.03 27.36-11.25 27.36zM377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9z"
              ></path></svg
            ><!-- <i class="fas fa-file-upload fa-lg"></i> --></label
          ><input
            id="chooseImage"
            type="file"
            accept="image/*"
            style="visibility: hidden; display: none"
            @change="uploadImage"
            ref="uploadImage"
          />
        </div>
        <div class="tool save-image" @click="saveImage">
          <svg
            class="svg-inline--fa fa-save fa-w-14 fa-lg"
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="save"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            data-fa-i2svg=""
          >
            <path
              fill="currentColor"
              d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z"
            ></path></svg
          ><!-- <i class="fas fa-save fa-lg"></i> -->
        </div>
      </div>
      <Editor
        :canvasWidth="width"
        :canvasHeight="height"
        ref="editor"
        editorId="canvasId"
      />
    </div>
  </div>
</template>

<script>
import Editor from "vue-image-markup";
import Slider from "primevue/slider";
// import Dropdown from "primevue/dropdown";
export default {
  components: {
    Editor,
    Slider
    // ,Dropdown
  },
  props: {
    dataUrl: {
      type: String,
      require: true,
      default: "/assets/img/item-sm-0.361a0872.png", //todo remove
    },
  },
  emits: ["saveImage"],
  data() {
    return {
      height: 0,
      width: 0,
      imgSrc: "",
      mode: "",
      shouldUpdate: false,
      colors: [
        "#e40000",
        "#e8eb34",
        "#a834eb",
        "#65c31a",
        "#34b7eb",
        "#eb34df",
        "#1a10ad",
        "#000",
      ],
      activeColor: "#001",
      strokeWidth: 2,
    };
  },
  mounted() {
    this.changeStrokeWidth();
    this.$refs.editor.drawImageInEditor(this.dataUrl);
    // let img = new Image();
    // img.src = this.dataUrl;
    // img.onload = (event) => {
    //   let from_element = document
    //     .querySelector(".tool.save-image")
    //     .getBoundingClientRect();
    //   // debugger;
    //   let html = document.querySelector("html").getBoundingClientRect();
    //   let canvas_height = Math.abs(html.height - from_element.top - 100);
    //   let canvas_width = Math.abs(
    //     html.width - (html.width - from_element.right) - html.width * 0.05
    //   );
    //   let img_height = event.target.height;
    //   let img_width = event.target.width;
    //   let rotate = 0;

    //   if (
    //     (img_height > img_width && canvas_height > canvas_width) ||
    //     (img_height < img_width && canvas_height < canvas_width)
    //   ) {
    //     rotate = 0;
    //   } else {
    //     let x;
    //     x = img_width;
    //     img_width = img_height;
    //     img_height = x;
    //     rotate = 270;
    //   }

    //   let img_difference = img_width / img_height;
    //   let canvas_difference = canvas_width / canvas_height;

    //   if (img_difference > canvas_difference) {
    //     this.height = (canvas_width / img_width) * img_height;
    //     this.width = canvas_width;
    //   } else {
    //     this.height = canvas_height;
    //     this.width = (canvas_height / img_height) * img_width;
    //   }
    //   this.$refs.editor.setSizes(this.height, this.width);
    //   // this.$refs.editor.setZoom(this.width / img_width);
    //   this.$refs.editor.setBackgroundImage(this.dataUrl, {
    //     scaleX: 1 / 1,
    //     scaleY: 1 / 1,
    //     angle: rotate * -1,
    //     left: (event.target.height * rotate * (100 / 270)) / 100,
    //   });
    // };
  },
  watch: {
    mode: function () {
    },
  },
  methods: {
    // drawImageInEditor(urlImg) {
    //   let img = new Image();
    //   img.src = urlImg;
    //   //התאמת גודל התמונה למסך
    //   img.onload = event => {
    //     let from_element = document
    //       .querySelector(".tool.save-image")
    //       .getBoundingClientRect();

    //     let html = document.querySelector("html").getBoundingClientRect();
    //     let canvas_height = html.height - from_element.top - 100;
    //     let canvas_width = html.width - (html.width - from_element.right) - 100;
    //     let img_height = event.target.height;
    //     let img_width = event.target.width;
    //     let rotate = 0;

    //     if (
    //       (img_height > img_width && canvas_height > canvas_width) ||
    //       (img_height < img_width && canvas_height < canvas_width)
    //     ) {
    //       rotate = 0;
    //     } else {
    //       let x;
    //       x = img_width;
    //       img_width = img_height;
    //       img_height = x;
    //       rotate = 270;
    //     }

    //     let img_difference = img_width / img_height;
    //     let canvas_difference = canvas_width / canvas_height;

    //     if (img_difference > canvas_difference) {
    //       this.height = (canvas_width / img_width) * img_height;
    //       this.width = canvas_width;
    //     } else {
    //       this.height = canvas_height;
    //       this.width = (canvas_height / img_height) * img_width;
    //     }
    //     this.$refs.editor.setSizes(this.height, this.width);
    //     this.$refs.editor.setZoom(this.width / img_width);
    //     this.$refs.editor.setBackgroundImage(this.dataUrl, {
    //       scaleX: 1 / 1,
    //       scaleY: 1 / 1,
    //       angle: rotate * -1,
    //       left: (event.target.height * rotate * (100 / 270)) / 100
    //     });
    //   };
    //   this.$refs.editor.setBackgroundImage(this.dataUrl);
    // },

    changeColor(color) {
      this.activeColor = color;
      this.$refs.editor.changeColor(color);
    },

    setMode(mode) {
      this.mode = mode;
      this.$refs.editor.set(mode);
    },
    undo() {
      this.mode = "undo";
      this.$refs.editor.undo();
      setTimeout(() => {
        this.mode = "";
      }, 500);
    },
    redo() {
      this.mode = "redo";
      this.$refs.editor.redo();
      setTimeout(() => {
        this.mode = "";
      }, 500);
    },
    clear() {
      this.$refs.editor.clear();
      this.$refs.editor.drawImageInEditor(this.dataUrl);
    },
    saveImage() {
      var image = this.$refs.editor.saveImage();
      console.log(image);
      // this.imgSrc = image;
      this.$emit("saveImage", image);
      // this.saveImageAsFile(image);
    },
    saveImageAsFile: function (t) {
      var e = document.createElement("a");
      e.setAttribute("href", t),
        e.setAttribute("download", "image-markup"),
        e.click();
    },
    applyCropping() {
      this.mode = "";
      this.$refs.editor.applyCropping();
    },
    uploadImage(e) {
      this.$refs.editor.uploadImage(e);
    },
    changeStrokeWidth() {
      this.$refs.editor.setStrokeWidth(this.strokeWidth);
    },
    zoom() {
      this.$refs.editor.setZoom(2);
    },
    mobileAndTabletCheck() {
      return window.innerWidth <= 800 && window.innerHeight <= 600;
    },
  },
};
</script>

<style>
.editorComponent,
.editor-container,
.tool,
.editor {
  display: flex;
}
svg {
  width: 0.875em;
}
.active-tool {
  cursor: pointer;
  color: #4287f5;
}
.tool {
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  padding: 2px 5px;
  cursor: pointer;
}
.editor-container {
  flex-direction: column;
}
.editor {
  justify-content: space-between;
  align-items: center;
  flex-direction: row-reverse;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.current-color {
  border-radius: 5px;
  width: 38px;
  height: 32px;
}
.colors {
  display: flex;
  flex-direction: column;
  margin: 40px 25px 0 25px;
  align-items: center;
  justify-content: center;
}
.color-container {
  border-radius: 50%;
  width: 30px;
  height: 30px;
  margin: 5px 0;
}

svg:not(:root).svg-inline--fa {
  overflow: visible;
}
.svg-inline--fa {
  display: inline-block;
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
}
.svg-inline--fa.fa-lg {
  vertical-align: -0.225em;
}
.fa-lg {
  font-size: 1.33333em;
  line-height: 0.75em;
  vertical-align: -0.0667em;
}
.svg-inline--fa.fa-w-16 {
  width: 1em;
}
.svg-inline--fa.fa-w-8 {
  width: 0.5em;
}
.svg-inline--fa.fa-w-14 {
  width: 0.875em;
}
.textWidth {
  display: flex;
  justify-content: center;
}
.p-slider-vertical .p-slider-handle{
  left: auto;
}
.stroke-width-value{
  text-align: center;
  margin-bottom: 10px;
}
</style>
