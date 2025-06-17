"use client";

import {useFormStatus} from "react-dom";

type Props = {}

const UpdateButton = (props: Props) => {
    const {pending} = useFormStatus()
  return (
    <button className='bg-primary text-white px-2 py-1 rounded-lg hover:bg-yellow-600' disabled={pending}>{pending ? "Updating...": "Update"}</button>
  )
}

export default UpdateButton