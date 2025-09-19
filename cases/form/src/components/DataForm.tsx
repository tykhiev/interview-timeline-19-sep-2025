import { useState } from 'react'
import { SelectableUser } from '@/types/User.types'
import { FlexBox } from './FlexBox'
import { Input } from './Input'
import { Button } from './Button'

interface DataFormProps {
  mode: 'create' | 'edit' | 'delete' | 'view'
  initValues?: Partial<SelectableUser>
  onSubmit: (data: any) => void | Promise<void>
  onCancel: () => void
}

export const DataForm = ({ mode, initValues = {}, onSubmit, onCancel }: DataFormProps) => {
  const [formKey, setFormKey] = useState(0)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // For delete mode, use initValues directly since inputs are disabled
    if (mode === 'delete') {
      if (initValues.id !== undefined) {
        await onSubmit({ id: initValues.id, name: initValues.name || '', email: initValues.email || '' })
      }
      return
    }

    // For other modes, get data from form
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name')?.toString()
    const email = formData.get('email')?.toString()

    if (!name || !email) return

    const submitData = initValues.id !== undefined ? { id: initValues.id, name, email } : { name, email }
    await onSubmit(submitData)
  }

  const handleReset = () => {
    setFormKey((prev) => prev + 1) // Force form re-render to reset values
  }

  const isDisabled = mode === 'delete' || mode === 'view'
  const showResetButton = mode === 'create' || mode === 'edit'

  const getButtonText = () => {
    switch (mode) {
      case 'create':
        return '作成'
      case 'edit':
        return '更新'
      case 'delete':
        return '削除'
      case 'view':
        return '閉じる'
      default:
        return '送信'
    }
  }

  const getButtonTheme = () => {
    return mode === 'delete' ? 'danger' : 'primary'
  }

  return (
    <form key={formKey} onSubmit={handleSubmit}>
      <FlexBox flexDirection='column' gap='1rem'>
        <Input
          label='name'
          name='name'
          defaultValue={initValues.name || ''}
          disabled={isDisabled}
          required={!isDisabled}
        />
        <Input
          label='email'
          name='email'
          defaultValue={initValues.email || ''}
          disabled={isDisabled}
          required={!isDisabled}
        />

        <FlexBox gap='0.5rem' flexDirection='column'>
          <Button type='submit' theme={getButtonTheme()}>
            {getButtonText()}
          </Button>

          {showResetButton && (
            <Button type='button' theme='none' onClick={handleReset}>
              Reset
            </Button>
          )}

          <Button type='button' theme='none' onClick={onCancel}>
            戻る
          </Button>
        </FlexBox>
      </FlexBox>
    </form>
  )
}
