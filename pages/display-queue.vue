<script setup>
import { useDisplaySocket } from '@/composables/useDisplaySocket';
import { ref } from 'vue'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { toast } from 'vue-sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
const type = ref('WALK_IN')
const name = ref('')
const phone = ref('')
const queueNumber = ref(null)
const isSubmitting = ref(false)

function speak(text) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
        console.warn('[TTS] Speech synthesis is not supported in this environment.');
        return;
    }

    console.log('[TTS] 🔊', text);

    // Hentikan suara lain yang sedang berjalan
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';

    // Coba ambil voice bahasa Indonesia jika tersedia
    const voices = window.speechSynthesis.getVoices();
    const indoVoice = voices.find(v => v.lang === 'id-ID' || v.lang.startsWith('id'));
    if (indoVoice) {
        utterance.voice = indoVoice;
    } else {
        console.warn('[TTS] Voice id-ID not found, using default voice.');
    }

    // Tambahan: handle error
    utterance.onerror = (e) => {
        console.error('[TTS] SpeechSynthesisUtterance error:', e.error);
    };

    // Jalankan setelah delay kecil agar tidak ditolak oleh policy autoplay
    setTimeout(() => {
        window.speechSynthesis.speak(utterance);
    }, 100);
}


async function createQueue() {
    if (isSubmitting.value) return; // Hindari spam
    isSubmitting.value = true;
    const payload = { type: type.value }

    if (type.value === 'RESERVATION') {
        if (!name.value.trim()) {
            alert("Nama wajib diisi.");
            isSubmitting.value = false;
            return;
        }
        if (!/^08\d{8,12}$/.test(phone.value)) {
            alert("Nomor HP tidak valid (harus diawali 08).");
            isSubmitting.value = false;
            return;
        }

        payload.name = name.value.trim();
        payload.phone = phone.value.trim();

        payload.name = name.value
        payload.phone = phone.value
    }

    const { data, error } = await useCommon('/queue', {
        method: 'POST',
        body: payload,
    })

    if (error) {
        console.error('Gagal membuat antrian', error.value)
        toast.success(`Gagal membuat antrian!`);
        return
    } else {
        queueNumber.value = data?.queueNumber || 'Tidak diketahui'
        toast.success(`🎉 Antrian Berhasil Dibuat!`,
            {
                description: `Nomor Antrian Anda: ${queueNumber.value}`,
                duration: 5000,
            });
        name.value = ''
        phone.value = ''
    }

    isSubmitting.value = false;

}

definePageMeta({
    alias: "/display-queue",
    layout: false,
});


useDisplaySocket(); // 🚀 Aktifkan listener socket saat komponen di-mount

const displayStore = useDisplayStore();

onMounted(() => {
    speak('Suara Aktif')
    const { onQueueRecalled, onQueueCalled } = useCallSocket();

    onQueueRecalled(({ data }) => {
        console.log('📣 Recall:', data);
    });
    onQueueCalled(({ data }) => {
        // ✅ Panggil TTS jika teks tersedia
        console.log('📣 Call:', data);

    });
});
</script>
<template>
    <DashboardContent>
        <!-- <Button @click="speak('Suara aktif')">Aktifkan Suara</Button> -->

        <div class="text-2xl font-bold">Ambil Nomor Antrian</div>
        <Card class="w-full max-w-md space-y-4">
            <CardHeader>
                <CardTitle>Buat Antrian Baru</CardTitle>
                <CardDescription>
                    Pilih tipe antrian dan isi data jika perlu.
                </CardDescription>
            </CardHeader>

            <CardContent class="space-y-4">
                <div label="Tipe Antrian">
                    <Select v-model="type">
                        <SelectTrigger>
                            <SelectValue placeholder="Pilih tipe antrian" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="WALK_IN">WALK IN</SelectItem>
                            <SelectItem value="RESERVATION">RESERVATION</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div v-if="type === 'RESERVATION'" label="Nama">
                    <Input v-model="name" placeholder="Nama lengkap" />
                </div>

                <div v-if="type === 'RESERVATION'" label="Nomor HP">
                    <Input v-model="phone" placeholder="08xxxxxxxxxx" />
                </div>

                <Button class="w-full" :disabled="isSubmitting" :loading="isSubmitting" @click="createQueue">
                    Ambil Antrian
                </Button>

                <!-- <div v-if="queueNumber" class="text-center mt-4">
                    <p class="text-sm text-muted-foreground">Nomor Antrian Anda:</p>
                    <h2 class="text-2xl font-bold text-primary">{{ queueNumber }}</h2>
                </div> -->
            </CardContent>
        </Card>
        <!-- This is for displaying the queue -->
        <div class="text-2xl font-bold">Antrian Sedang Dipanggil</div>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card v-for="item in displayStore.currentCalled" :key="item.queueId">
                <!-- {{ item }} -->
                <CardHeader class="flex flex-row items-center justify-between space-y-0">
                    <CardTitle class="text-sm font-medium">{{ item.type }}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="text-2xl font-bold">{{ item.queueNumber }}</div>
                    <div class="text-lg font-semibold">{{ item.staff.name }}</div>
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
        <!-- <div class="text-2xl font-bold">Antrian Baru Selesai</div>
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card v-for="item in displayStore.recentCompleted" :key="item.queueId">
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle class="text-sm font-medium">{{ recent.type }} - {{ recent.status }}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="text-2xl font-bold">{{ item.queueNumber }}</div>
                </CardContent>
            </Card>
        </div> -->
    </DashboardContent>
</template>