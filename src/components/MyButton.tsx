import type { ButtonHTMLAttributes, ReactNode } from 'react'

type MyButtonProps = {
  children: ReactNode
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>

export default function MyButton({ children, type, ...props }: MyButtonProps) {
  return (
    <button type={type ?? 'button'} {...props}>
      {children}
    </button>
  )
}

