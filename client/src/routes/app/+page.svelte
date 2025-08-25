<script lang="ts">
    import { user, signIn, signOut, type PublicUser } from '$lib/auth/client';

    let error = '';

    async function doLogout() {
        try {
            await signOut();
            location.href = '/';
        } catch (err) {
            error = String(err);
        }
    }
</script>

{#if $user}<h1>Hello, {$user.displayName}</h1>{/if}
<button on:click={doLogout}>Sign out</button>
{#if error}<pre>{error}</pre>{/if}