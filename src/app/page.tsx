"use client";

import { Login } from "components/Login/login";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    // const session = useSession({
    //     required: true,
    //     onUnauthenticated() {
    //         return router.push("/signin");
    //     },
    // });

    // if(session.data?.user) {
    //     console.log(session.data);
    // };

    return (
         <>
        {/* {JSON.stringify(session)} */}
        <button className='text-white' onClick={() => signOut()}>Logout</button>
      </>
    );
  }

  Page.requireAuth = true