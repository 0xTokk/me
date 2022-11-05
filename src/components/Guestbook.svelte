<script lang="ts">
  import { onMount } from 'svelte';
  import type {Guest} from "../types"
  import {getAccount, connectWallet} from '../helpers/metamask.helper'
  import {signGuestbook, getGuestbook} from '../helpers/guestbook.helper'
  import { trimWalletAddress } from '../utils';

  let account: string | null = null;
  let guestbook: Guest[] | null = null;
  let message: string = '';

  onMount(async () => {
    guestbook = await getGuestbook();
		account =  await getAccount();
	});

  async function handleSignGuestbook() {
    const messageForGuestbook = message;
    message = '';
    await signGuestbook(messageForGuestbook);
    guestbook = await getGuestbook();
	}
</script>

<div class="container">
  <h2>Guestbook <span>&rarr;</span></h2>
  {#if account === null}
    <p>Connect your wallet to sign the guestbook.</p>
    <button 
      class="connect-wallet-btn" 
      on:click={connectWallet}
    >
      <span>Connect wallet</span>
    </button>
  {:else}
    <p>Leave a message in the guestbook.</p>
    <form on:submit|preventDefault={handleSignGuestbook}>
      <label for="message">Message: </label>
      <input 
        bind:value={message} 
        type='text' 
        placeholder="Your brief message" 
        id="message" 
        name="message" 
      />
      <button type="submit"><span>Sign guestbook</span></button>
    </form>
  {/if}
    <div class="message-list">
      {#if guestbook !== null}
        {#if guestbook.length}
          {#each guestbook as {wallet, timestamp, message} (timestamp)}
          <div>
            <div class="meta">
              <span>{trimWalletAddress(wallet)}</span>
              <span>{timestamp}</span>
            </div>
            <div class="message">
              <p>{message}</p>
            </div>
          </div>
          {/each}
        {:else if guestbook.length === 0}
          <p>The guestbook hasn't been signed yet!</p>
        {/if}
      {:else}
        <p>Cannot retrieve guestbook.</p> 
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

  .connect-wallet-btn {
    align-self: flex-start;
    margin-block-start: 24px;
    margin-block-end: 32px;
  }

  form {
    padding-block-start: 24px;
    padding-block-end: 32px;
    display: flex;
    align-items: baseline;
    gap: 12px;
  }

  input {
    flex: 1;
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

  .meta {
    display: flex;
    justify-content: space-between;
    margin-block-end: 6px;
  }
  
  .meta span {
    color: #757575;
    font-size: calc(14 / 16 * 1rem);
  }

  .message {
    border-radius: 1px 6px 6px 6px;
    background-image: var(--accent-gradient);
    background-size: 400%;
  }

  .message p {
    background-color: white;
    opacity: 0.90;
    color: #111;
    padding-block: 10px; 
    padding-inline: 14px;
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
