import { useState } from 'react'
import { SelectableUser } from '@/types/User.types'
import { FlexBox } from './FlexBox'
import { Input } from './Input'
import { Button } from './Button'

type UserRole = 'owner' | 'writer' | 'viewer'

interface DataFormProps {
  mode: 'create' | 'edit' | 'delete' | 'view'
  initValues?: Partial<SelectableUser>
  userRole?: UserRole
  onSubmit: (data: any) => void | Promise<void>
  onCancel: () => void
}

export const DataForm = ({ mode, initValues = {}, userRole = 'writer', onSubmit, onCancel }: DataFormProps) => {
  const [formKey, setFormKey] = useState(0)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (mode === 'delete') {
      if (initValues.id !== undefined) {
        await onSubmit({ id: initValues.id, name: initValues.name || '', email: initValues.email || '' })
      }
      return
    }

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name')?.toString()
    const email = formData.get('email')?.toString()

    if (!name || !email) return

    const submitData = initValues.id !== undefined ? { id: initValues.id, name, email } : { name, email }
    await onSubmit(submitData)
  }

  const handleReset = () => {
    setFormKey((prev) => prev + 1)
  }

  const isDisabled = mode === 'delete' || mode === 'view'
  const showResetButton = (mode === 'create' || mode === 'edit') && userRole !== 'viewer'
  const canSubmit = userRole !== 'viewer' || mode === 'view'

  const getButtonText = () => {
    switch (mode) {
      case 'create':
        return userRole === 'owner' ? 'Create User' : userRole === 'writer' ? '作成' : 'Request Creation'
      case 'edit':
        return userRole === 'owner' ? 'Update Immediately' : userRole === 'writer' ? '更新' : 'Request Update'
      case 'delete':
        return userRole === 'owner' ? '削除' : 'Request Deletion'
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
          {canSubmit && (
            <Button type='submit' theme={getButtonTheme()}>
              {getButtonText()}
            </Button>
          )}

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
