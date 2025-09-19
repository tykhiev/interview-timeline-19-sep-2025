import { InsertableUser, SelectableUser, UpdatableUser } from '@/types/User.types'
import { DataForm } from './DataForm'

type UserRole = 'owner' | 'writer' | 'viewer'

interface UserFormProps {
  mode: 'create' | 'update' | 'delete'
  onSubmit: (data: InsertableUser | UpdatableUser) => void
  initValues?: Partial<SelectableUser>
  userRole?: UserRole
  onCancel: () => void
}

export const UserForm = ({ mode, onSubmit, initValues = {}, userRole, onCancel }: UserFormProps) => {
  const formMode = mode === 'update' ? 'edit' : mode

  return (
    <DataForm mode={formMode} initValues={initValues} userRole={userRole} onSubmit={onSubmit} onCancel={onCancel} />
  )
}
