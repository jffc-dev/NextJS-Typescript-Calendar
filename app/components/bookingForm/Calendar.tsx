'use client'

import {useLocale, useCalendar} from 'react-aria'
import {useCalendarState} from 'react-stately'
import {createCalendar} from '@internationalized/date'
import {DateValue, CalendarProps} from '@react-types/calendar'
import { CalendarHeader } from './CalendarHeader'
import { CalendarGrid } from './CalendarGrid'

export const Calendar = (props: CalendarProps<DateValue> & {
    isDateUnavailable?: (date: DateValue) => boolean
}) => {
    const {locale} = useLocale()
    const state = useCalendarState({
        ...props,
        visibleDuration: {months: 1},
        locale,
        createCalendar
    });
      
    const { calendarProps, prevButtonProps, nextButtonProps } = useCalendar(
        props,
        state
    );
      
    return (
        <div {...calendarProps} className="inline-block">
            <CalendarHeader state={state} calendarProps={calendarProps}
                prevButtonProps={prevButtonProps} 
                nextButtonProps={nextButtonProps}/>

            <div className='flex gap-8'>
                <CalendarGrid state={state} isDateUnavailable={props.isDateUnavailable}/>
            </div>
        </div>
    )
}
