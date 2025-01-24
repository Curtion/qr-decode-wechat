<script setup lang="ts">
import type { Result } from '../../src/types'
import { onMounted, ref } from 'vue'
import { decode, ready } from '../../src/main'

const canvasPreview = ref<HTMLCanvasElement>()
const result = ref<Result[]>()
const selected = ref(false)
const error = ref<any>()
const loaded = ref(false)

onMounted(() => {
  ready()
    .then(() => {
      loaded.value = true
    })
    .catch((e) => {
      error.value = e
      console.error(e)
    })
})

async function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) {
    return
  }

  error.value = null
  const reader = new FileReader()
  const promise = new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
  })
  reader.readAsDataURL(file)
  const dataurl = await promise
  selected.value = true

  const img = new Image()
  img.src = dataurl as string
  await new Promise<void>((resolve) => {
    img.onload = () => resolve()
  })

  canvasPreview.value!.width = img.width
  canvasPreview.value!.height = img.height
  canvasPreview.value!.getContext('2d')!.drawImage(img, 0, 0)

  const MAX_WIDTH = 400
  const { width, height } = img
  const canvas = document.createElement('canvas')
  canvas.width = MAX_WIDTH
  canvas.height = (MAX_WIDTH * height) / width
  const ctx = canvas.getContext('2d')!
  ctx.filter = 'grayscale(100%) contrast(200%) brightness(100%)'
  ctx.drawImage(img, 0, 0, width, height, 0, 0, MAX_WIDTH, canvas.height)

  try {
    result.value = await decode(canvas)

    console.log('result', result.value)
  } catch (e) {
    error.value = e
    console.error(e)
  }
}
</script>

<template>
  <main>
    <input type="file" accept="image/*" @change="onFileChange">
    <div v-if="error">
      {{ error }}
    </div>
    <div v-if="selected">
      <div>{{ result }}</div>
      <canvas ref="canvasPreview" />
    </div>

    <div v-if="!loaded">
      <span>Loading models...</span>
    </div>
  </main>
</template>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
