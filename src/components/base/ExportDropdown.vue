<template>
  <div class="relative" ref="containerRef">
    <button
      :disabled="disabled"
      @click="toggle"
      class="flex items-center gap-1.5 rounded-lg bg-tegbale-blue px-4 py-2 text-sm font-roboto font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
    >
      Export
      <svg
        class="h-4 w-4 transition-transform duration-150"
        :class="open ? 'rotate-180' : ''"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
      </svg>
    </button>

    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="scale-95 opacity-0"
      enter-to-class="scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="scale-100 opacity-100"
      leave-to-class="scale-95 opacity-0"
    >
      <div
        v-if="open"
        class="absolute right-0 mt-1 w-40 origin-top-right rounded-xl bg-white py-1 shadow-lg ring-1 ring-black/5 z-20"
      >
        <button
          @click="exportAs('csv')"
          class="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-roboto text-gray-700 hover:bg-gray-50 rounded-t-xl"
        >
          <svg class="h-4 w-4 text-tegbale-green flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          CSV
        </button>
        <button
          @click="exportAs('xls')"
          class="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-roboto text-gray-700 hover:bg-gray-50 rounded-b-xl"
        >
          <svg class="h-4 w-4 text-tegbale-blue flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
          Excel (.xls)
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'

interface Column {
  header: string
  value: (row: any, index: number) => string | number
}

const props = defineProps<{
  rows: any[]
  columns: Column[]
  filename: string
  disabled?: boolean
}>()

const open = ref(false)
const containerRef = ref<HTMLElement | null>(null)

const toggle = () => { if (!props.disabled) open.value = !open.value }

const handleClickOutside = (e: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    open.value = false
  }
}

watch(open, (val) => {
  if (val) document.addEventListener('click', handleClickOutside, true)
  else document.removeEventListener('click', handleClickOutside, true)
})

onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside, true))

function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
}

function exportAs(format: 'csv' | 'xls') {
  open.value = false
  const { rows, columns, filename } = props

  if (format === 'csv') {
    const header = columns.map(c => `"${c.header}"`).join(',')
    const body = rows
      .map((r, i) => columns.map(c => `"${String(c.value(r, i + 1)).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    download(
      new Blob([`${header}\n${body}`], { type: 'text/csv;charset=utf-8;' }),
      `${filename}.csv`,
    )
  } else {
    const thead = `<tr>${columns.map(c => `<th>${c.header}</th>`).join('')}</tr>`
    const tbody = rows
      .map((r, i) => `<tr>${columns.map(c => `<td>${c.value(r, i + 1)}</td>`).join('')}</tr>`)
      .join('')
    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"/></head><body><table>${thead}${tbody}</table></body></html>`
    download(
      new Blob([html], { type: 'application/vnd.ms-excel' }),
      `${filename}.xls`,
    )
  }
}
</script>
