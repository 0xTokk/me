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

  async function handleConnectWallet() {
    account = await connectWallet();
  }
 
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
    <button on:click={handleConnectWallet}><span>Connect wallet</span></button>
  {:else}
    <form on:submit|preventDefault={handleSignGuestbook}>
      <label for="message">Message: </label>
      <input bind:value={message} type='text' placeholder="Your brief message" id="message" name="message" />
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
		padding: 16px;
    border: 1px solid rgb(var(--accent), 0.25);
		border-radius: 8px;
	}

  form {
    padding-block-start: 24px;
    padding-block-end: 32px;
    display: flex;
    align-items: baseline;
    gap: 12px;
  }

  input {
    border: 1px solid rgb(var(--accent), 0.25);
    border-radius: 8px;
    padding: 12px;
  }
  
  button {
    border: none;
    border-radius: 8px;
    background-image: var(--accent-gradient);
    background-size: 400%;
    background-position: 100%;
    transition: background-position 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    padding: 2px;
    cursor: pointer;
  }

  button > span {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #111;
    font-weight: 600;
    background-color: white;
    opacity: 0.8;
    padding: 12px;
    border-radius: 6px;
    transition: color 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }

	button:hover, 
  button:focus {
		background-position: 0;
	}
	button:hover span, 
  button:focus span {
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
	}

	p {
		margin-top: 0.5rem;
		margin-bottom: 0;
		color: #444;
	}
</style>
