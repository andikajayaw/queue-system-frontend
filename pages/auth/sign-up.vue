<script setup lang="ts">
import { ref } from 'vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'vue-sonner';

definePageMeta({
    alias: "/sign-up",
    layout: false,
});

// Form state
const formData = ref({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STAFF' // Default role
});

const isSubmitting = ref(false);
const errors = ref({});

// Validation function
const validateForm = () => {
    const newErrors = {};

    if (!formData.value.name.trim()) {
        newErrors.name = 'Nama wajib diisi';
    }

    if (!formData.value.username.trim()) {
        newErrors.username = 'Username wajib diisi';
    } else if (formData.value.username.length < 3) {
        newErrors.username = 'Username minimal 3 karakter';
    }

    if (!formData.value.email.trim()) {
        newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.value.email)) {
        newErrors.email = 'Format email tidak valid';
    }

    if (!formData.value.password) {
        newErrors.password = 'Password wajib diisi';
    } else if (formData.value.password.length < 6) {
        newErrors.password = 'Password minimal 6 karakter';
    }

    if (!formData.value.confirmPassword) {
        newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
    } else if (formData.value.password !== formData.value.confirmPassword) {
        newErrors.confirmPassword = 'Password tidak cocok';
    }

    errors.value = newErrors;
    return Object.keys(newErrors).length === 0;
};

// Submit handler
const handleSubmit = async () => {
    if (!validateForm()) {
        toast.error('Silakan periksa form kembali');
        return;
    }

    isSubmitting.value = true;

    try {
        const payload = {
            name: formData.value.name.trim(),
            username: formData.value.username.trim(),
            email: formData.value.email.trim(),
            password: formData.value.password,
            role: formData.value.role
        };

        console.log('Registering user with payload:', payload);

        const { data, error } = await useCommon('/auth/register', {
            method: 'POST',
            body: payload
        });

        if (error.value) {
            console.error('Registration error:', error.value);

            // Handle specific error cases
            if (error.value.statusCode === 409) {
                toast.error('Email sudah terdaftar');
            } else if (error.value.statusCode === 401) {
                toast.error('Anda tidak memiliki izin untuk mendaftarkan user');
            } else {
                toast.error(error.value.message || 'Gagal mendaftarkan user');
            }
        } else {
            console.log('Registration successful:', data.value);
            toast.success('User berhasil didaftarkan!');

            // Reset form
            formData.value = {
                name: '',
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
                role: 'STAFF'
            };
            errors.value = {};
        }
    } catch (err) {
        console.error('Registration error:', err);
        toast.error('Terjadi kesalahan saat mendaftarkan user');
    } finally {
        isSubmitting.value = false;
    }
};

// Clear error when user types
const clearError = (field: string) => {
    if (errors.value[field]) {
        delete errors.value[field];
    }
};
</script>

<template>
    <div class="flex h-screen w-full items-center justify-center px-4">
        <Card class="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle class="text-xl">Daftar</CardTitle>
                <CardDescription>
                    Masukkan informasimu untuk membuat akun
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form @submit.prevent="handleSubmit" class="grid gap-4">
                    <!-- Name Field -->
                    <div class="grid gap-2">
                        <Label for="name">Nama</Label>
                        <Input id="name" v-model="formData.name" placeholder="Masukkan nama lengkap" required
                            :class="{ 'border-red-500': errors.name }" @input="clearError('name')" />
                        <span v-if="errors.name" class="text-sm text-red-500">{{ errors.name }}</span>
                    </div>

                    <!-- Username Field -->
                    <div class="grid gap-2">
                        <Label for="username">Username</Label>
                        <Input id="username" v-model="formData.username" placeholder="Masukkan username" required
                            :class="{ 'border-red-500': errors.username }" @input="clearError('username')" />
                        <span v-if="errors.username" class="text-sm text-red-500">{{ errors.username }}</span>
                    </div>

                    <!-- Email Field -->
                    <div class="grid gap-2">
                        <Label for="email">Email</Label>
                        <Input id="email" v-model="formData.email" type="email" placeholder="m@example.com" required
                            :class="{ 'border-red-500': errors.email }" @input="clearError('email')" />
                        <span v-if="errors.email" class="text-sm text-red-500">{{ errors.email }}</span>
                    </div>

                    <!-- Role Field -->
                    <!-- <div class="grid gap-2">
                        <Label for="role">Role</Label>
                        <Select v-model="formData.role">
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="STAFF">Staff</SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div> -->

                    <!-- Password Field -->
                    <div class="grid gap-2">
                        <Label for="password">Password</Label>
                        <Input id="password" v-model="formData.password" type="password" placeholder="Masukkan password"
                            required :class="{ 'border-red-500': errors.password }" @input="clearError('password')" />
                        <span v-if="errors.password" class="text-sm text-red-500">{{ errors.password }}</span>
                    </div>

                    <!-- Confirm Password Field -->
                    <div class="grid gap-2">
                        <Label for="confirm-password">Konfirmasi Password</Label>
                        <Input id="confirm-password" v-model="formData.confirmPassword" type="password"
                            placeholder="Konfirmasi password" required
                            :class="{ 'border-red-500': errors.confirmPassword }"
                            @input="clearError('confirmPassword')" />
                        <span v-if="errors.confirmPassword" class="text-sm text-red-500">{{ errors.confirmPassword
                        }}</span>
                    </div>

                    <Button type="submit" class="w-full" :disabled="isSubmitting">
                        {{ isSubmitting ? 'Mendaftarkan...' : 'Buat akun' }}
                    </Button>
                </form>

                <div class="mt-4 text-center text-sm">
                    Sudah punya akun?
                    <NuxtLink to="/sign-in" class="underline"> Masuk disini </NuxtLink>
                </div>
            </CardContent>
        </Card>
    </div>
</template>