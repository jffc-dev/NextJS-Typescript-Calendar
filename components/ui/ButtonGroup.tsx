'use client'
import { Children, cloneElement, ReactElement } from "react"
import { cn } from "@/lib/utils"
import { ButtonProps } from "./button"

interface iAppProps {
    className?: string
    children: ReactElement<ButtonProps>[]
}

export const ButtonGroup = ({className, children}: iAppProps) => {
    const totalBUttons = Children.count(children)
  return (
    <div className={cn('flex w-full', className)}>
        {children.map((child, index) => {
            const isFirstItem = index === 0
            const isLastItem = index === totalBUttons - 1

            return cloneElement(child, {
                className: cn({
                    'rounded-l-none': !isFirstItem,
                    'rounded-r-none': !isLastItem,
                    'border-l-0': !isFirstItem
                }, child.props.className)
            })
        })}
    </div>
  )
}