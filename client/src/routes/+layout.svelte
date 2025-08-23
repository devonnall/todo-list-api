<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { auth } from '$lib/firebase/firebaseConfig';
	import { authStore } from '$lib/stores/authStore';
	import { onAuthStateChanged } from 'firebase/auth';
	
	onMount(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			authStore.update((curr) => {
				return { ...curr, user, loading: false };
			})
		})
		
		return () => unsubscribe();
	})

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
