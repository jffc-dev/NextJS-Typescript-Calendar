'use server'

import prisma from "./lib/db"
import { requireUser } from "./lib/hooks"
import { parseWithZod } from '@conform-to/zod'
import { eventTypeSchema, onboardingSchemaValidation, settingsSchema } from "./lib/zodSchemas"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export const OnboardingAction = async(prevState: any, formData: FormData) => {
    
    const session = await requireUser()

    const submission = await parseWithZod(formData, {
        schema: onboardingSchemaValidation({
            async isUsernameUnique(){
                const existingUsername = await prisma.user.findUnique({
                    where: {
                        userName: formData.get('userName') as string
                    }
                })

                return !existingUsername
            }
        }),
        async: true
    })

    if(submission.status !== 'success'){
        return submission.reply()
    }
    
    const data = await prisma.user.update({
        where: {
            id: session.user?.id
        },
        data: {
            userName: submission.value.userName,
            name: submission.value.fullName,
            availabilities: {
                createMany: {
                    data: [
                        {
                            day: 'Monday',
                            fromTime: '08:00',
                            tillTime: '18:00'
                        },{
                            day: 'Tuesday',
                            fromTime: '08:00',
                            tillTime: '18:00'
                        },{
                            day: 'Wednesday',
                            fromTime: '08:00',
                            tillTime: '18:00'
                        },{
                            day: 'Thursday',
                            fromTime: '08:00',
                            tillTime: '18:00'
                        },{
                            day: 'Friday',
                            fromTime: '08:00',
                            tillTime: '18:00'
                        },{
                            day: 'Saturday',
                            fromTime: '08:00',
                            tillTime: '18:00'
                        },{
                            day: 'Sunday',
                            fromTime: '08:00',
                            tillTime: '18:00'
                        }
                    ]
                }
            }
        }
    })
    console.log(data);
    
    return redirect('/onboarding/grant-id')
}

export const SettingsAction = async(prevState: any, formData: FormData) => {
    const session = await requireUser()
    const submission = parseWithZod(formData, {
        schema: settingsSchema
    })

    if(submission.status !== 'success'){
        return submission.reply()
    }

    await prisma.user.update({
        where: {
            id: session.user?.id
        },
        data: {
            name: submission.value.fullName,
            image: submission.value.profileImage,
        }
    })

    return redirect('/dashboard')
}

export const updateAvailabilityAction = async(formData: FormData) => {
    await requireUser()
    const rawData = Object.fromEntries(formData.entries())

    const availabilityData = Object.keys(rawData).filter((key: string)=>key.startsWith('id-'))
        .map((key) => {
            const id = key.replace('id-','')
            return {
                id,
                isActive: rawData[`isActive-${id}`] === 'on',
                fromTime: rawData[`fromTime-${id}`] as string,
                tillTime: rawData[`tillTime-${id}`] as string
            }
        })

    try {
        await prisma.$transaction(
            availabilityData.map((item)=>
                prisma.availability.update({
                    where: {
                        id: item.id
                    },
                    data: {
                        isActive: item.isActive,
                        fromTime: item.fromTime,
                        tillTime: item.tillTime
                    }
                })
            )
        )
    } catch (error) {
        console.log(error)
    }

    revalidatePath('/dashboard/availability')
}

export const CreateEventTypeAction = async(prevState: any, formData: FormData) => {
    const session = await requireUser()
    const submission = parseWithZod(formData, {
        schema: eventTypeSchema
    })

    if(submission.status !== 'success'){
        return submission.reply()
    }

    await prisma.eventType.create({
        data: {
            title: submission.value.title,
            duration: submission.value.duration,
            url: submission.value.url,
            description: submission.value.description,
            videoCallSoftware: submission.value.videoCallSoftware,
            userId: session.user?.id
        }
    })

    return redirect('/dashboard')
}