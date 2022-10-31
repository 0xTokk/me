<script context="module" lang="ts">
  import type {Guest} from "../types"
  import {getAccount, connectWallet} from '../helpers/metamask'
  import {signGuestbook, getGuestbook} from '../helpers/guestbook'
  import { trimWalletAddress } from '../utils';
</script>

<script lang="ts">
  let account: Promise<string | null> = getAccount();
  let guestbook: Promise<Guest[] | null> = getGuestbook();

  async function handleSignGuestbook(event: Event) {
    event.preventDefault();
    //@ts-ignore
    const message = (event.currentTarget as HTMLFormElement).elements.message.value;
    await signGuestbook(message);
    guestbook = getGuestbook();
	}
</script>

<div>
    <form on:submit={handleSignGuestbook}>
      <label for="message">Message: </label>
      <input type='text' placeholder="Leave a message" id="message" name="message" />
      <button type="submit">Sign guestbook</button>
    </form>
    {#await account}
      <p>...fetching account info</p>
    {:then account}
      {#if account === null}
        <button on:click={connectWallet}>Connect wallet</button>
      {:else}
        <button on:click={handleSignGuestbook}>Sign guestbook</button>
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
