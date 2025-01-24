<script setup lang="ts">
import type { Result } from 'qr-decode-wechat'
import { decode, ready } from 'qr-decode-wechat'
import { onMounted, ref } from 'vue'

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

    // 绘制识别区域红框
    const previewCtx = canvasPreview.value!.getContext('2d')!
    previewCtx.strokeStyle = 'red'
    previewCtx.lineWidth = 2

    const scaleFactor = img.width / MAX_WIDTH
    result.value?.forEach((item, index) => {
      if (item.rect) {
        const { x, y, width, height } = item.rect
        previewCtx.strokeRect(
          x * scaleFactor,
          y * scaleFactor,
          width * scaleFactor,
          height * scaleFactor,
        )
        // 绘制编号
        previewCtx.fillStyle = 'red'
        previewCtx.font = '20px Arial'
        previewCtx.fillText(
          `#${index + 1}`,
          x * scaleFactor + 5,
          y * scaleFactor + 25,
        )
      }
    })

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
      <div class="result-container">
        <canvas ref="canvasPreview" />
      </div>

      <div v-if="!loaded">
        <span>Loading models...</span>
      </div>

      <div v-if="result" class="results">
        <h3>识别结果：</h3>
        <div class="result-list">
          <div v-for="(item, index) in result" :key="index" class="result-item">
            <span class="index">#{{ index + 1 }}</span>
            <span class="text">{{ item.text }}</span>
          </div>
        </div>
      </div>
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

.results {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.result-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 10px;
}

.result-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.index {
  font-weight: bold;
  color: red;
  margin-right: 10px;
}

.text {
  word-break: break-all;
}
</style>
