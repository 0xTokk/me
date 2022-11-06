<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import type {Guest} from "../types"
  import {getAccount, connectWallet} from '../helpers/metamask.helper'
  import {getContract} from '../helpers/guestbook.helper'
  import { trimWalletAddress } from '../utils';

  let account: string | null = null;
  let guestbook: Guest[] | null = null;
  let message: string = '';

  async function getGuestbook(): Promise<Guest[]| null> {
    try {
      const guestbookContract = getContract();

      if (guestbookContract) {
        let guestbook = await guestbookContract.getGuestbook();
        console.log("getGuestbook: Retrieved guests...", guestbook);

        if (!guestbook.length) {
          return guestbook;
        }

        return guestbook.map((guest: Guest) => ({
            wallet: guest.wallet,
            timestamp: new Date(Number(guest.timestamp) * 1000).toDateString(),
            message: guest.message
        }));

      } else {
        console.log('guestbookContract not found');
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async function signGuestbook(message: string): Promise<void> {
    try {
      const guestbookContract = getContract();

      if (guestbookContract) {
        let count = await guestbookContract.getGuestCount();
        console.log("signGuestbook: Guest count...", count.toNumber());

        // actually write to the blockchain
        const signTxn = await guestbookContract.sign(message, {gasLimit: 300000});
        console.log("Mining...", signTxn.hash);

        await signTxn.wait();
        console.log("Mined -- ", signTxn.hash);

        count = await guestbookContract.getGuestCount();
        console.log("signGuestbook: Guest count...", count.toNumber());

      } else {
        console.log('guestbookContract not found');
      }
    } catch (error) {
      console.log(error);
    }
  }

  function onNewSignGuestbook(wallet: string, timestamp: number, message: string) {
    console.log("NewGuest", wallet, timestamp, message);

    if (guestbook !== null) {
      guestbook = [...guestbook, {
        wallet: wallet,
        timestamp: new Date(Number(timestamp) * 1000).toDateString(),
        message: message,
      }]
    }
  }  

  onMount(async () => {
		account =  await getAccount();
    guestbook = await getGuestbook();
    const guestbookContract = getContract();

    if (guestbookContract !== null) {
      guestbookContract.on("NewGuest", onNewSignGuestbook);
    }

	});

  onDestroy(() => {
    const guestbookContract = getContract();

    if (guestbookContract !== null) {
      guestbookContract.off("NewGuest", onNewSignGuestbook);
    }
  })

  async function handleSignGuestbook() {
    const messageForGuestbook = message;
    message = '';
    await signGuestbook(messageForGuestbook);
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
          {#each guestbook as {wallet, timestamp, message}}
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
    padding-block-end: 48px;
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
    gap: 16px;
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
