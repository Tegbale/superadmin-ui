<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div>
        <h1 class="text-3xl font-normal text-tegbale-navy-blue font-roboto">School Requests</h1>
        <p class="text-sm text-tegbale-text-gray font-roboto mt-0.5">Review and approve schools requesting access to Tègbalé</p>
      </div>
    </div>

    <!-- Status filter tabs -->
    <div class="flex gap-2 mb-5">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="setTab(tab.value)"
        class="rounded-full px-4 py-1.5 text-sm font-roboto transition-colors"
        :class="activeTab === tab.value
          ? 'bg-tegbale-blue text-white'
          : 'bg-white border border-gray-200 text-tegbale-text-gray hover:border-tegbale-blue hover:text-tegbale-blue'"
      >
        {{ tab.label }}
        <span v-if="tab.value === 'PENDING' && pendingCount > 0" class="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[10px]">{{ pendingCount }}</span>
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <!-- Loading skeleton -->
      <div v-if="loading && !requests.length" class="p-6 space-y-3">
        <div v-for="i in 5" :key="i" class="h-12 rounded-xl bg-gray-100 animate-pulse" />
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm font-roboto min-w-[640px]">
          <thead>
            <tr class="text-left text-tegbale-text-gray border-b border-gray-100">
              <th class="px-6 py-4 font-normal">S/N</th>
              <th class="px-6 py-4 font-normal">School</th>
              <th class="px-6 py-4 font-normal hidden md:table-cell">Contact</th>
              <th class="px-6 py-4 font-normal hidden lg:table-cell">Location</th>
              <th class="px-6 py-4 font-normal">Submitted</th>
              <th class="px-6 py-4 font-normal">Status</th>
              <th class="px-6 py-4 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr
              v-for="(req, i) in requests"
              :key="req.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 text-tegbale-text-gray">{{ (page - 1) * limit + i + 1 }}</td>
              <td class="px-6 py-4">
                <p class="font-medium text-tegbale-navy-blue">{{ req.schoolName }}</p>
              </td>
              <td class="px-6 py-4 hidden md:table-cell">
                <p class="text-tegbale-navy-blue">{{ req.contactFirstName }} {{ req.contactLastName }}</p>
                <p class="text-tegbale-text-gray text-xs">{{ req.contactEmail }}</p>
              </td>
              <td class="px-6 py-4 text-tegbale-text-gray hidden lg:table-cell">
                {{ [req.city, req.country].filter(Boolean).join(', ') || '—' }}
              </td>
              <td class="px-6 py-4 text-tegbale-text-gray">{{ formatDate(req.createdAt) }}</td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" :class="statusClass(req.status)">
                  {{ req.status }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <!-- View details -->
                  <button title="View details" class="text-tegbale-blue hover:text-blue-700" @click="openDetail(req)">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                  <!-- Approve -->
                  <button
                    v-if="req.status === 'PENDING'"
                    title="Approve & create account"
                    class="text-tegbale-green hover:text-green-700"
                    @click="handleApprove(req)"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </button>
                  <!-- Reject -->
                  <button
                    v-if="req.status === 'PENDING'"
                    title="Reject"
                    class="text-red-400 hover:text-red-600"
                    @click="openReject(req)"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!requests.length && !loading">
              <td colspan="7" class="px-6 py-12 text-center text-tegbale-text-gray">
                No {{ activeTab !== undefined ? activeTab.toLowerCase() : '' }} requests found
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-between border-t border-gray-100 px-6 py-4">
        <p class="text-sm text-tegbale-text-gray font-roboto">{{ total }} request{{ total !== 1 ? 's' : '' }}</p>
        <div class="flex gap-2">
          <BaseButton variant="secondary" size="sm" :disabled="page <= 1" @click="changePage(page - 1)">Prev</BaseButton>
          <span class="flex items-center px-3 text-sm font-roboto text-tegbale-text-gray">{{ page }} / {{ totalPages }}</span>
          <BaseButton variant="secondary" size="sm" :disabled="page >= totalPages" @click="changePage(page + 1)">Next</BaseButton>
        </div>
      </div>
    </div>

    <!-- Detail slide-over -->
    <BaseModal :show="!!detailTarget" title="Request Details" @close="detailTarget = null">
      <div v-if="detailTarget" class="space-y-4 text-sm font-roboto">
        <div class="grid grid-cols-2 gap-x-6 gap-y-3">
          <div><p class="text-tegbale-text-gray text-xs mb-0.5">School name</p><p class="font-medium text-tegbale-navy-blue">{{ detailTarget.schoolName }}</p></div>
          <div><p class="text-tegbale-text-gray text-xs mb-0.5">Status</p><span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" :class="statusClass(detailTarget.status)">{{ detailTarget.status }}</span></div>
          <div><p class="text-tegbale-text-gray text-xs mb-0.5">Contact name</p><p>{{ detailTarget.contactFirstName }} {{ detailTarget.contactLastName }}</p></div>
          <div><p class="text-tegbale-text-gray text-xs mb-0.5">Email</p><p>{{ detailTarget.contactEmail }}</p></div>
          <div><p class="text-tegbale-text-gray text-xs mb-0.5">Phone</p><p>{{ detailTarget.contactPhone || '—' }}</p></div>
          <div><p class="text-tegbale-text-gray text-xs mb-0.5">Location</p><p>{{ [detailTarget.city, detailTarget.country].filter(Boolean).join(', ') || '—' }}</p></div>
          <div><p class="text-tegbale-text-gray text-xs mb-0.5">Submitted</p><p>{{ formatDate(detailTarget.createdAt) }}</p></div>
        </div>
        <div v-if="detailTarget.message">
          <p class="text-tegbale-text-gray text-xs mb-1">Message</p>
          <p class="text-tegbale-navy-blue leading-relaxed bg-gray-50 rounded-xl p-3">{{ detailTarget.message }}</p>
        </div>
        <div v-if="detailTarget.cacDocumentUrl || detailTarget.govtDocumentUrl" class="space-y-2">
          <p class="text-tegbale-text-gray text-xs mb-1">Uploaded Documents</p>
          <div class="flex flex-wrap gap-2">
            <a
              v-if="detailTarget.cacDocumentUrl"
              :href="detailTarget.cacDocumentUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 rounded-lg border border-tegbale-blue/30 bg-blue-50 px-3 py-2 text-xs font-roboto text-tegbale-blue hover:bg-blue-100 transition-colors"
            >
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              CAC Certificate
            </a>
            <a
              v-if="detailTarget.govtDocumentUrl"
              :href="detailTarget.govtDocumentUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 rounded-lg border border-tegbale-blue/30 bg-blue-50 px-3 py-2 text-xs font-roboto text-tegbale-blue hover:bg-blue-100 transition-colors"
            >
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              Govt. Approval Document
            </a>
          </div>
        </div>
        <div v-if="detailTarget.notes">
          <p class="text-tegbale-text-gray text-xs mb-1">Rejection note</p>
          <p class="text-red-600 bg-red-50 rounded-xl p-3">{{ detailTarget.notes }}</p>
        </div>
        <div v-if="detailTarget.status === 'PENDING'" class="flex gap-3 pt-2">
          <BaseButton class="flex-1" @click="handleApprove(detailTarget); detailTarget = null">Approve & Create Account</BaseButton>
          <BaseButton variant="secondary" class="flex-1" @click="openReject(detailTarget); detailTarget = null">Reject</BaseButton>
        </div>
      </div>
    </BaseModal>

    <!-- Reject modal -->
    <BaseModal :show="!!rejectTarget" title="Reject Request" @close="rejectTarget = null">
      <div v-if="rejectTarget" class="space-y-4 text-sm font-roboto">
        <p class="text-tegbale-text-gray">Rejecting request from <strong class="text-tegbale-navy-blue">{{ rejectTarget.schoolName }}</strong>. You can optionally add a note.</p>
        <textarea
          v-model="rejectNote"
          rows="3"
          placeholder="Reason for rejection (optional)"
          class="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-roboto focus:border-tegbale-blue focus:outline-none focus:ring-2 focus:ring-tegbale-blue/20 resize-none"
        ></textarea>
        <div class="flex gap-3">
          <BaseButton variant="secondary" class="flex-1" @click="rejectTarget = null">Cancel</BaseButton>
          <BaseButton variant="danger" class="flex-1" :loading="actionLoading" @click="handleReject">Confirm Reject</BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getSchoolRequests, approveSchoolRequest, rejectSchoolRequest } from '@/api/schoolRequests'
import { useToastStore } from '@/stores/toast.store'
import type { SchoolRequest, RequestStatus } from '@/types'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseModal from '@/components/base/BaseModal.vue'

const toast = useToastStore()

const requests = ref<SchoolRequest[]>([])
const loading = ref(false)
const actionLoading = ref(false)
const total = ref(0)
const page = ref(1)
const limit = 20
const totalPages = ref(1)
const pendingCount = ref(0)

const activeTab = ref<RequestStatus | undefined>(undefined)
const detailTarget = ref<SchoolRequest | null>(null)
const rejectTarget = ref<SchoolRequest | null>(null)
const rejectNote = ref('')

const tabs = [
  { label: 'All', value: undefined as RequestStatus | undefined },
  { label: 'Pending', value: 'PENDING' as RequestStatus },
  { label: 'Approved', value: 'APPROVED' as RequestStatus },
  { label: 'Rejected', value: 'REJECTED' as RequestStatus },
]

const fetchRequests = async () => {
  loading.value = true
  try {
    const res = await getSchoolRequests({ page: page.value, limit, status: activeTab.value })
    const data = res.data.data
    requests.value = data.requests
    total.value = data.total
    totalPages.value = Math.ceil(data.total / limit)
  } finally {
    loading.value = false
  }
}

const fetchPendingCount = async () => {
  try {
    const res = await getSchoolRequests({ page: 1, limit: 1, status: 'PENDING' })
    pendingCount.value = res.data.data.total
  } catch {}
}

const setTab = (status: RequestStatus | undefined) => {
  activeTab.value = status
  page.value = 1
  fetchRequests()
}

const changePage = (p: number) => { page.value = p; fetchRequests() }

const openDetail = (req: SchoolRequest) => { detailTarget.value = req }
const openReject = (req: SchoolRequest) => { rejectNote.value = ''; rejectTarget.value = req }

const handleApprove = async (req: SchoolRequest) => {
  if (!confirm(`Approve "${req.schoolName}" and create their school account? Credentials will be emailed to ${req.contactEmail}.`)) return
  actionLoading.value = true
  try {
    await approveSchoolRequest(req.id)
    toast.success(`Account created for ${req.schoolName}. Credentials sent to ${req.contactEmail}.`)
    await fetchRequests()
    await fetchPendingCount()
  } catch (err) {
    toast.error(typeof err === 'string' ? err : 'Failed to approve request')
  } finally {
    actionLoading.value = false
  }
}

const handleReject = async () => {
  if (!rejectTarget.value) return
  actionLoading.value = true
  try {
    await rejectSchoolRequest(rejectTarget.value.id, rejectNote.value || undefined)
    toast.success('Request rejected')
    rejectTarget.value = null
    await fetchRequests()
    await fetchPendingCount()
  } catch (err) {
    toast.error(typeof err === 'string' ? err : 'Failed to reject request')
  } finally {
    actionLoading.value = false
  }
}

const statusClass = (status: RequestStatus) => ({
  'bg-amber-50 text-amber-600': status === 'PENDING',
  'bg-green-50 text-green-600': status === 'APPROVED',
  'bg-red-50 text-red-500': status === 'REJECTED',
})

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

onMounted(() => { fetchRequests(); fetchPendingCount() })
</script>
