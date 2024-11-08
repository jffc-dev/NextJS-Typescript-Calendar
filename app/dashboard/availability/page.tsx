import { updateAvailabilityAction } from '@/app/actions';
import { SubmitButton } from '@/app/components/SubmitButtons';
import prisma from '@/app/lib/db';
import { requireUser } from '@/app/lib/hooks';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { times } from '@/lib/times';
import { notFound } from 'next/navigation';

const getData = async(userId: string) => {
    const data = await prisma.availability.findMany({
        where: {
            userId: userId
        }
    })

    if(!data){
        return notFound()
    }

    return data
}

const AvailabilityRoute = async() => {
    const session = await requireUser()
    const data = await getData(session.user?.id as string)
    return (
        <Card>
            <CardHeader>
                <CardTitle>Availability</CardTitle>
                <CardDescription>In this section you can manage your availability!</CardDescription>
            </CardHeader>
            <form action={updateAvailabilityAction}>
                <CardContent className='flex flex-col gap-y-4'>
                    {data.map((item) => (
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center gap-4' key={item.id}>
                            <input type="hidden" value={item.id} name={`id-${item.id}`} />
                            <div className="flex items-center gap-x-3">
                                <Switch name={`isActive-${item.id}`} defaultChecked={item.isActive} />
                                <p>{item.day}</p>
                            </div>

                            <Select name={`fromTime-${item.id}`} defaultValue={item.fromTime}>
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='From time'/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {times.map((time)=>(
                                            <SelectItem value={time.time} key={time.id}>
                                                {time.time}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <Select name={`tillTime-${item.id}`} defaultValue={item.tillTime}>
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='Till time'/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {times.map((time)=>(
                                            <SelectItem value={time.time} key={time.id}>
                                                {time.time}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    ))}
                </CardContent>
                <CardFooter>
                    <SubmitButton text='Save Changes'/>
                </CardFooter>
            </form>
        </Card>
    )
}

export default AvailabilityRoute