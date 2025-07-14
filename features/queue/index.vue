<script setup lang="ts">
import { useCallSocket } from '@/composables/useCallSocket'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

useDisplaySocket(); // 🚀 Aktifkan listener socket saat komponen di-mount

const displayStore = useDisplayStore();
// const token = useCookie('token'); // Ganti 'token' sesuai nama cookie-mu
// const { onQueueCalled, onQueueRecalled, onQueueUpdated, socket: callSocket } = useCallSocket()
const nextQueue: any = ref([]);
const currentCalled: any = ref([]);
const showConfirmModal = ref(false)
const selectedCurrentQueue = ref<any>(null)

// async function callNextQueue() {
//     // Emit ke backend untuk panggil antrian berikutnya
//     // callSocket.emit('call-next')
//     // onQueueCalled((data) => {
//     //     console.log('Queue called:', data)
//     // })

//     try {
//         const token = useCookie('token')?.value.user;
//         const { id } = token; // pastikan token berisi staffId
//         console.log(id)
//         const response = await useCommon('/call/next', {
//             method: 'POST',
//             body: { staffId: id },
//         });

//         if (response?.success) {
//             const queue = response.data;
//             // speak(queue.text); // Text dari backend sudah TTS-ready
//             fetchQueueData();  // Refresh tampilan
//         } else {
//             alert(response.message || 'Tidak ada antrian berikutnya');
//         }
//     } catch (error) {
//         console.error('Gagal memanggil antrian berikutnya:', error);
//     }
// }

async function callNextQueue() {
    // console.log(displayStore.currentCalled)
    if (filteredCurrentCalled.value.length > 0) {
        selectedCurrentQueue.value = filteredCurrentCalled.value[0]; // Ambil yang aktif
        showConfirmModal.value = true; // Tampilkan modal konfirmasi
        return;
    }

    await proceedToNextQueue(); // Jika tidak ada antrian aktif, langsung lanjut
}

async function recallCurrentQueue(payload) {
    if (!payload?.id) return;

    try {
        const response = await useCommon(`/call/recall/${payload.id}`, {
            method: 'POST',
        });
        console.log(response)

        if (response?.data?.value.success) {
            // TTS akan dipanggil otomatis via socket dari event `queue-recalled`
            console.log('Recall success:', response?.data?.value.message);
        } else {
            console.error('Recall gagal:', response?.data?.value.message);
        }
    } catch (error) {
        console.error('Gagal memanggil ulang antrian:', error);
    }
}

async function completeCurrentQueue(payload: any) {
    if (!payload?.id) return;

    try {
        const response = await useCommon(`/call/completed/${payload.id}`, {
            method: 'PATCH',
        });

        if (response?.data?.value?.success) {
            console.log('Queue completed:', response?.data?.value.message);
            // fetchQueueData(); // refresh tampilan current/next queue
        } else {
            console.error('Failed to complete queue:', response?.data?.value.message);
        }
    } catch (error) {
        console.error('Error completing queue:', error);
    }
}


const fetchQueueData = async () => {
    try {
        // console.log(token.value)
        // Fetch current serving, next queue, and stats
        const [next, current] = await Promise.all([
            // useCommon('/call/current'),
            // useCommon('/queue/dashboard-stats'),
            useCommon('/display/next-waiting'),
            useCommon('/display/current-called'),
        ]);

        // currentServing.value = serving;
        // dashboardStats.value = stats.data;
        nextQueue.value = next;
        currentCalled.value = current;
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
    }
};

async function proceedToNextQueue() {
    try {
        const user = useCookie('user');
        const { id } = user.value;
        const response = await useCommon('/call/next', {
            method: 'POST',
            body: { staffId: id },
        });

        if (response?.data?.value?.success) {
            fetchQueueData();  // Refresh tampilan
        } else {
            alert(response?.data?.value.message || 'Tidak ada antrian berikutnya');
        }
    } catch (error) {
        console.error('Gagal memanggil antrian berikutnya:', error);
    }
}

async function handleCompleteAndNext() {
    await completeCurrentQueue(selectedCurrentQueue.value);
    showConfirmModal.value = false;
    await proceedToNextQueue();
}

async function handleCancelAndNext() {
    try {
        const response = await useCommon(`/call/completed/${selectedCurrentQueue.value.id}`, {
            method: 'PATCH',
        });

        if (response?.data?.value?.success) {
            showConfirmModal.value = false;
            await fetchQueueData();
            await proceedToNextQueue();
        } else {
            alert(response?.data?.value.message || 'Gagal membatalkan antrian');
        }
    } catch (err) {
        console.error('Error canceling queue:', err);
    }
}


// onMounted(() => {
//     // Fetch initial data
//     fetchQueueData();
// });
const staffId = useCookie('user')?.value?.id;
// console.log(staffId);
const filteredCurrentCalled = computed(() => {
    return displayStore.currentCalled.filter(item => item?.staff?.id === staffId);
});
const filteredRecentCompleted = computed(() => {
    return displayStore.recentCompleted.filter(item => item?.staff?.id === staffId);
});

</script>

<template>
    <DashboardContent>
        <div class="flex gap-4 mt-4">
            <Button class="bg-blue-600 text-white hover:bg-blue-700" :disabled="displayStore.nextWaiting.length === 0"
                @click="callNextQueue">
                Panggil Antrian Berikutnya
            </Button>
        </div>
        <!-- {{ displayStore }} -->
        <!-- <pre>{{ displayStore }}</pre> -->
        <div class="text-2xl font-bold">Antrian Sedang Dipanggil</div>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card v-for="item in filteredCurrentCalled" :key="item.queueId">
                <CardHeader class="flex flex-row items-center justify-between space-y-0">
                    <CardTitle class="text-sm font-medium">{{ item.type }}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="grid items-end gap-2">
                        <div class="text-2xl font-bold">{{ item.queueNumber }}</div>
                        <Button class="bg-yellow-500 text-white hover:bg-yellow-600" @click="recallCurrentQueue(item)">
                            Ulang Panggil
                        </Button>
                        <Button class="bg-blue-500 text-white hover:bg-blue-600" @click="completeCurrentQueue(item)">
                            Selesai
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div class="text-2xl font-bold">Antrian Selanjutnya</div>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card v-for="item in displayStore.nextWaiting" :key="item.queueId">
                <CardHeader class="flex flex-row items-center justify-between space-y-0">
                    <CardTitle class="text-sm font-medium">{{ item.type }}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="text-2xl font-bold">{{ item.queueNumber }}</div>
                </CardContent>
            </Card>
        </div>

        <div class="text-2xl font-bold">Antrian Baru Selesai</div>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card v-for="item in filteredRecentCompleted" :key="item.queueId">
                <CardHeader class="flex flex-row items-center justify-between space-y-0">
                    <CardTitle class="text-sm font-medium">{{ item.type }}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="text-2xl font-bold">{{ item.queueNumber }}</div>
                    <div class="text-lg font-semibold">{{ item.staff.name }}</div>

                </CardContent>
            </Card>
        </div>
    </DashboardContent>
    <Dialog v-model:open="showConfirmModal">
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Antrian Sebelumnya Belum Diselesaikan</DialogTitle>
                <DialogDescription>
                    Antrian <strong>{{ selectedCurrentQueue?.queueNumber }}</strong> belum ditandai selesai.
                    Apa yang ingin kamu lakukan sebelum lanjut ke antrian berikutnya?
                </DialogDescription>
            </DialogHeader>
            <div class="flex flex-col gap-2 mt-4">
                <Button class="bg-blue-600 text-white" @click="handleCompleteAndNext">Selesaikan & Lanjut</Button>
                <Button class="bg-red-600 text-white" @click="handleCancelAndNext">Batalkan & Lanjut</Button>
                <Button variant="outline" @click="showConfirmModal = false">Batal</Button>
            </div>
        </DialogContent>
    </Dialog>

</template>