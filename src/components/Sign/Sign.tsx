import { createSignal, createEffect } from 'solid-js';
import type {Guest} from "../../types"
import {getAccount, connectWallet} from '../../helpers/metamask'
import {signGuestbook, getGuestbook} from '../../helpers/guestbook'

export default function Sign() {
	const [currentAccount, setCurrentAccount] = createSignal<string | null>();
  const [guestbook, setGuestbook] = createSignal<Guest[] | null>();

  async function getAndSetAccount() {
    const account = await getAccount();
		if (account !== null) setCurrentAccount(account);
  }

  async function getAndSetGuestbook() {
    const guestbook = await getGuestbook();
    if (guestbook !== null) setGuestbook(guestbook);
  }

	createEffect(async () => {
		getAndSetAccount();
    getAndSetGuestbook();
	});

  async function handleSignGuestbook(event: Event) {
    event.preventDefault();
    //@ts-ignore
    const message = (event.currentTarget as HTMLFormElement).elements.message.value;
    await signGuestbook(message);
    getAndSetGuestbook();
	}

	return (
		<div>
			{currentAccount() 
				?
        <form onSubmit={handleSignGuestbook}>
          <label for="message">Message: </label>
          <input type='text' placeholder="Leave a message" id="message" name="message" />
          <button type="submit">Sign guestbook</button>
        </form>
				:
				<button onClick={() => connectWallet()}>Connect wallet</button>
			}
      {guestbook()?.map(guest => 
        <p>{guest.wallet.slice(0,4)}...{guest.wallet.slice(-4)} says "{guest.message}"</p>
      )}
		</div>
	);
}