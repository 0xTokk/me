<script lang="ts">
  import { onMount } from 'svelte';
  import type {Guest} from "../types"
  import {getAccount, connectWallet} from '../helpers/metamask'
  import {signGuestbook, getGuestbook} from '../helpers/guestbook'
  import { trimWalletAddress } from '../utils';

  let account: string | null;
  let guestbook: Guest[] | null;
  let message: string = '';

  onMount(async () => {
		account =  await getAccount();
    guestbook = await getGuestbook();
	});

  async function handleSignGuestbook() {
    const messageValue = message;
    message = '';
    await signGuestbook(messageValue);
    guestbook = await getGuestbook();
	}
</script>

<div class="container">
  <h2>Guestbook <span>&rarr;</span></h2>
  {#if account === null}
    <button on:click={connectWallet}>Connect wallet</button>
  {:else}
    <form on:submit|preventDefault={handleSignGuestbook}>
      <label for="message">Message: </label>
      <input bind:value={message} type='text' placeholder="Your message" id="message" name="message" />
      <button on:click={handleSignGuestbook}><span>Sign guestbook</span></button>
    </form>
  {/if}

  <div class="message-list">
    {#if guestbook}
      {#each guestbook as guest}
      <p>{trimWalletAddress(guest.wallet)} says "{guest.message}"</p>
      {/each}
    {:else} 
      <p>loading guestbook...</p>
    {/if}
  </div>
</div>

<style>
	.container {
    background-color: white;
		display: flex;
    flex-direction: column;
    gap: 12px;
		padding: 16px;
		border-radius: 16px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
	}
  
  button {
    border: none;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    background-color: white;
    background-image: var(--accent-gradient);
    background-size: 400%;
    padding: 3px;
    background-position: 100%;
    transition: background-position 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    cursor: pointer;
  }

  button > span {
    display: flex;
    justify-content: center;
    align-items: center;
		color: #111;
		background-color: white;
		opacity: 0.8;
    font-weight: 600;
    padding: 12px;
		border-radius: 6px;
	}

	button:is(:hover, :focus-within) {
		background-position: 0;
	}
	button:is(:hover, :focus-within) span {
		color: rgb(var(--accent));
	}

  .message-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

	h2 {
		margin: 0;
		font-size: 1.25rem;
		transition: color 0.6s cubic-bezier(0.22, 1, 0.36, 1);
	}

	p {
		margin-top: 0.5rem;
		margin-bottom: 0;
		color: #444;
	}
</style>
