import '@root/global.scss';

import { redirect } from 'next/navigation';

export default async function Page(props) {
  redirect('/ddm');
}
