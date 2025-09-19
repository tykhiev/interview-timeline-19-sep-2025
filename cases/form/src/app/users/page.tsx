'use client'

import { Button } from '@/components/Button'
import { FlexBox } from '@/components/FlexBox'
import { useEffect, useState } from 'react'
import styles from './page.module.scss'
import {} from '@/components/Input'
import { useMe } from '@/hooks/useMe'
import { UserForm } from '@/components/UserForm'
import { isInsertableUser, isSelectableUser, isUpdatableUser, SelectableUser } from '@/types/User.types'

type User = {
  id: number
  name: string
  email: string
}

const createUser = (data: Omit<User, 'id'>) =>
  fetch('/api/users', {
    method: 'post',
    body: JSON.stringify(data),
  })
const getUsers = () => fetch('/api/users')
const updateUser = (data: User) =>
  fetch('/api/users', {
    method: 'put',
    body: JSON.stringify(data),
  })
const deleteUser = (data: Pick<User, 'id'>) =>
  fetch(`/api/users?id=${data.id}`, {
    method: 'delete',
  })

export default function Page() {
  const me = useMe()
  const [users, setUsers] = useState<User[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'update' | 'delete'>('create')
  const [modalInitValues, setModalInitValues] = useState<Partial<User>>({})

  const isUser = (data: unknown): data is User => {
    return (
      typeof data === 'object' &&
      data !== null &&
      'id' in data &&
      typeof data.id === 'number' &&
      'name' in data &&
      typeof data.name === 'string' &&
      'email' in data &&
      typeof data.email === 'string'
    )
  }

  const getUsers = async () => {
    try {
      const res = await fetch('/api/users')

      if (!res.ok) {
        throw new Error('Failed to fetch users')
      }

      const data: unknown = await res.json()

      if (Array.isArray(data) && data.every((item) => isUser(item))) {
        return data
      } else {
        throw new Error('Invalid data format')
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  useEffect(() => {
    getUsers()
      .then((data) => {
        setUsers(data)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [])

  const handleEdit = (user: SelectableUser) => {
    setModalInitValues(user)
    setModalMode('update')
    setModalOpen(true)
  }

  const handleCreate = () => {
    setModalMode('create')
    setModalOpen(true)
  }

  const handleDelete = (user: SelectableUser) => {
    setModalMode('delete')
    setModalInitValues(user)
    setModalOpen(true)
  }

  console.log(modalMode, modalInitValues)

  return (
    <main>
      <FlexBox flexDirection='column'>
        <FlexBox justifyContent='center' width='100%' padding={'1rem'}>
          Hello, {me.name} ({me.role})
        </FlexBox>
        {(me.role === 'writer' || me.role === 'owner') && (
          <Button type='button' onClick={handleCreate}>
            アカウント追加
          </Button>
        )}

        <table>
          <thead>
            <tr>
              <th className={styles.header}>Id</th>
              <th className={styles.header}>Name</th>
              <th className={styles.header}>Email</th>
              <th className={styles.header}>Menu</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <Button type='button' onClick={() => handleEdit(user)}>
                    編集
                  </Button>
                  <Button type='button' onClick={() => handleDelete(user)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </FlexBox>
      {modalOpen && (
        <UserForm
          mode={modalMode}
          initValues={modalInitValues}
          onSubmit={async (data) => {
            console.log(modalMode, data)
            if (modalMode === 'create') {
              if (isInsertableUser(data)) {
                await createUser(data)
                const updatedUsers = await getUsers() // refetch users after create
                setUsers(updatedUsers)
              }
            } else if (modalMode === 'update') {
              if (isUpdatableUser(data)) {
                await updateUser(data)
                const updatedUsers = await getUsers() // refetch users after update
                setUsers(updatedUsers)
              }
            } else if (modalMode === 'delete') {
              if (isSelectableUser(data)) {
                await deleteUser({ id: data.id })
                const updatedUsers = await getUsers() // refetch users after delete
                setUsers(updatedUsers)
              }
            }
            setModalOpen(false)
          }}
          onCancel={() => setModalOpen(false)}
        />
      )}
    </main>
  )
}
