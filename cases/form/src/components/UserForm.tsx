import { InsertableUser, SelectableUser, UpdatableUser } from '@/types/User.types'
import { DataForm } from './DataForm'

interface UserFormProps {
  mode: 'create' | 'update' | 'delete'
  onSubmit: (data: InsertableUser | UpdatableUser) => void
  initValues?: Partial<SelectableUser>
  onCancel: () => void
}

export const UserForm = ({ mode, onSubmit, initValues = {}, onCancel }: UserFormProps) => {
  const formMode = mode === 'update' ? 'edit' : mode

  return <DataForm mode={formMode} initValues={initValues} onSubmit={onSubmit} onCancel={onCancel} />
}
