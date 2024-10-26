import { notFound } from "next/navigation"
import prisma from "../lib/db"
import { requireUser } from "../lib/hooks"
import EmptyState from "../components/EmptyState"

const getData = async(userId: string) => {
  const data = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      userName: true,
      eventTypes: {
        select: {
          id: true,
          isActive: true,
          title: true,
          url: true,
          duration: true
        }
      }
    }
  })

  if(!data){
    return notFound()
  }

  return data
}

const DashboardPage = async() => {
    
    const session = await requireUser()
    const data = await getData(session.user?.id as string)
    console.log(session);

  return (
    <>
      {data.eventTypes.length === 0 ? (
        <EmptyState title="You have no Event Types" description="You can create your first event type by clicking the button below" buttonText="Add event type" href="/dashboard/new"/>
      ): (
        <p>we have event types</p>
      )}
    </>
  )
}

export default DashboardPage