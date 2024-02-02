"use client";
import { SessionProvider as Provider } from 'next-auth/react';

type Props = {
  children: React.ReactElement | React.ReactElement[];
}

export default function SessionProvider({children}: Props) {
  return (
    <Provider>
      {children}
    </Provider>
  )
}
