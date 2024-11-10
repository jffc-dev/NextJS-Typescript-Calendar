import { deleteEventTypeAction } from "@/app/actions"
import { SubmitButton } from "@/app/components/SubmitButtons"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const DeleteEventType = ({params}: {params: {eventTypeId: string}}) => {
    return (
        <div className="flex flex-1 items-center justify-center">
            <Card className="max-w-[450px] w-full">
                <CardHeader>
                    <CardTitle>Delete Event Type</CardTitle>
                    <CardDescription>Are you sure you want to delete this event?</CardDescription>
                </CardHeader>
                <CardFooter className="w-full flex justify-between">
                    <Button variant='secondary' asChild>
                        <Link href={'/dashboard'}>Cancel</Link>
                    </Button>
                    <form action={deleteEventTypeAction}>
                        <input type="hidden" name="id" value={params.eventTypeId} />
                        <SubmitButton variant='destructive' text="Delete Event"/>
                    </form>
                </CardFooter>
            </Card>
        </div>
    )
}

export default DeleteEventType