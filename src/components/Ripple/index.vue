<template>
  <div class="rippleComponent">
    <div class="ripple">
      <svg
        class="waves"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shape-rendering="auto"
      >
        <defs>
          <path
            id="gentle-wave"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          ></path>
        </defs>

        <g class="parallax">
          <use
            xlink:href="#gentle-wave"
            x="48"
            y="0"
            class="fill-[rgba(249,249,249,0.7)] dark:fill-[rgba(35,41,49,0.9)]"
          ></use>
          <use
            xlink:href="#gentle-wave"
            x="48"
            y="3"
            class="fill-[rgba(249,249,249,0.5)] dark:fill-[rgba(35,41,49,0.9)]"
          ></use>
          <use
            xlink:href="#gentle-wave"
            x="48"
            y="5"
            class="fill-[rgba(249,249,249,0.3)] dark:fill-[rgba(35,41,49,0.9)]"
          ></use>
          <use
            xlink:href="#gentle-wave"
            x="48"
            y="7"
            class="fill-[rgba(249,249,249)] dark:fill-[rgba(35,41,49,0.9)]"
          ></use>
        </g>
      </svg>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
