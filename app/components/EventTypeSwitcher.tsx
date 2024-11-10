'use client'
import { Switch } from "@/components/ui/switch"
import { useFormState } from "react-dom"
import { updateEventTypeStatusAction } from "../actions"
import { useEffect, useTransition } from "react"
import { toast } from "sonner"

export const MenuActiveSwitcher = (
    {initialChecked, eventTypeId}: 
    {initialChecked: boolean, eventTypeId: string}
) => {
    const [isPending, startTransition] = useTransition()
    const [state, action] = useFormState(updateEventTypeStatusAction, undefined)

    useEffect(() => {
      if(state?.status === 'success'){
        toast.success(state.message)
      }else if(state?.status === 'error'){
        toast.error(state.message)
      }

    }, [state])
    

    return (
        <Switch defaultChecked={initialChecked} disabled={isPending} onCheckedChange={(isChecked: boolean)=>{
            startTransition(()=>{
                action({
                    eventTypeId: eventTypeId,
                    isChecked: isChecked
                })
            })
        }}/>
    )
}