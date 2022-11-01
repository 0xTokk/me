<script context="module" lang="ts">
  import type {Guest} from "../types"
  import {getAccount, connectWallet} from '../helpers/metamask'
  import {signGuestbook, getGuestbook} from '../helpers/guestbook'
  import { trimWalletAddress } from '../utils';
</script>

<script lang="ts">
  let account: Promise<string | null> = getAccount();
  let guestbook: Promise<Guest[] | null> = getGuestbook();
  let message: string = '';
  // let status: string | null = null;

  async function handleSignGuestbook() {
    const messageToSend = message;
    message = '';
    await signGuestbook(messageToSend);
    guestbook = getGuestbook();
	}
</script>

<div>
  {#await account}
    <p>...getting account</p>
  {:then account}
    {#if account === null}
      <button on:click={connectWallet}>Connect wallet</button>
    {:else}
      <form on:submit|preventDefault={handleSignGuestbook}>
        <label for="message">Message: </label>
        <input bind:value={message} type='text' placeholder="Your message" id="message" name="message" />
        <button on:click={handleSignGuestbook}>Sign guestbook</button>
      </form>
    {/if}
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
  {#await guestbook}
    <p>...fetching guestbook</p>
  {:then guestbook}
    {#if guestbook}
      {#each guestbook as guest (guest.id)}
        <p>{trimWalletAddress(guest.wallet)} says "{guest.message}"</p>
      {/each}
    {/if}
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
</div>
