'use client'
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from './toast'

import { CircleCheckBig, Terminal, AlertCircle } from 'lucide-react'
import { useToast } from './use-toast'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, variant, action, ...props }) => {
        let IconComponent
        switch (variant) {
          case 'destructive':
            IconComponent = AlertCircle
            break
          case 'success':
            IconComponent = CircleCheckBig
            break
          default:
            IconComponent = Terminal
        }

        return (
          <Toast key={id} variant={variant} {...props}>
            <div className='flex items-center space-x-2'>
              <div className='flex-shrink-0'>
                <IconComponent className='h-7 w-7' />
              </div>
              <div className='flex-1'>
                <div className='grid gap-1'>
                  {title && <ToastTitle>{title}</ToastTitle>}
                  {description && <ToastDescription>{description}</ToastDescription>}
                </div>
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
