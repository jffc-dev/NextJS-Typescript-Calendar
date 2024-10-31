'use client'
import { useRouter, useSearchParams } from "next/navigation"
import { Calendar } from "./Calendar"
import { today, getLocalTimeZone, DateValue, parseDate, CalendarDate} from '@internationalized/date'
import { useEffect, useState } from "react"

interface IAppProps {
    availability: {
        day: string
        isActive: boolean
    }[]
}

export const RenderCalendar = ({availability}: IAppProps) => {
    const searchParams = useSearchParams()
    const router = useRouter()

    const [date, setDate] = useState(()=>{
        const dateParam = searchParams.get('date')
        return dateParam ? parseDate(dateParam) : today(getLocalTimeZone())
    })

    useEffect(() => {
        const dateParam = searchParams.get('date')
        if(dateParam){
            setDate(parseDate(dateParam))
        }
    }, [searchParams])
    

    const handleDateChange = (date: DateValue) => {
        setDate(date as CalendarDate)
        const url = new URL(window.location.href)
        url.searchParams.set('date', date.toString())
        router.push(url.toString())
    }

    const isDateUnavailable = (date: DateValue) => {
        const dayOfWeek = date.toDate(getLocalTimeZone()).getDay()
        const adjustedIndex = dayOfWeek===0 ? 6 : dayOfWeek - 1
        return !availability[adjustedIndex].isActive
    }

    return (
        <Calendar minValue={today(getLocalTimeZone())} isDateUnavailable={isDateUnavailable} value={date} onChange={handleDateChange}/>
    )
}
