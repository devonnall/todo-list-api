<script lang="ts">
    import { signUpEmail, signInEmail } from "$lib/auth";
    import { apiFetch } from "$lib/api";
    import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
    import { auth } from "$lib/firebase/client";
    import Logo from '$lib/assets/Logo.svelte';
    import { Menu } from '@lucide/svelte';

    let me: any = null;
    let email = '', password = '', displayName = '', error = '';

    async function signInWithGoogle() {
        await signInWithPopup(auth, new GoogleAuthProvider());

        const res = await apiFetch('/api/users/me');
        me = await res.json();
    }

    async function doSignUp() {
        try {
            await signUpEmail({ email, password, displayName });
            await apiFetch('/api/users/me');;
            location.href = '/app';
        } catch (e) {
            error = String(e);
        }
    }

    async function doSignIn() {
        try {
            await signInEmail(email, password);
            await apiFetch('/api/users/me');
            location.href = '/app';
        } catch (e) {
            error = String(e);
        }
    }
</script>

<div class="sticky flex items-center justify-between px-4 h-12">
    <Logo />
    <Menu class="cursor-pointer size-5" />
</div>

<div class="flex flex-col items-center h-[calc(100vh-48px)] bg-gradient-to-b from-red-50 to-red-100 space-y-4">
    <div class="flex flex-col items-center pt-12 text-primary-contrast-50">
        <h1 class="hidden sm:block text-3xl font-bold">Stay Organized, Stay Creative</h1>
        <h1 class="sm:hidden text-3xl font-bold">Stay Organized</h1>
        <h1 class="sm:hidden text-3xl font-bold">Stay Creative</h1>
    </div>
    <p class="text-primary-contrast-50 px-8 mb-8 max-w-lg text-sm font-light text-center">Join millions of people to capture ideas, organize life, and do something creative.</p>
    <button on:click={() => location.href = '/signup'} class="bg-red-500 hover:bg-red-400 text-red-50 p-2 px-4 rounded-xl">Get Started</button>
</div>

<!-- <h2>Login</h2>
<input placeholder="email" bind:value={email} />
<input placeholder="password" type="password" bind:value={password} />
<button on:click={doSignIn}>Sign in</button>

<h2>Sign Up</h2>
<input placeholder="display name" bind:value={displayName} />
<button on:click={doSignUp}>Sign up</button>

{#if error}<pre>{error}</pre>{/if} -->