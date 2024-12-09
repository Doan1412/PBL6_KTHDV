import { User } from '@/src/app/types/user.type'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table'
import { Badge } from '@/src/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/src/components/ui/alert-dialog'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import avtDefault from '@/src/app/assets/avtDefault.png'
import { XCircleIcon, CheckIcon, DocumentMagnifyingGlassIcon } from '@heroicons/react/24/solid'
import Img from '@/src/app/assets/no_data.svg'
import { Skeleton } from '@/src/components/ui/skeleton'

interface UserTableProps {
  users: User[]
  dataLoaded: boolean
  handleBanActivate: (user: User) => void
}

const UserTable: React.FC<UserTableProps> = ({ users, dataLoaded, handleBanActivate }) => {
  const t = useTranslations('list_users')

  return (
    <div className='w-[98%] flex justify-center rounded-lg shadow-xl m-5'>
      <Table className='w-full max-w-6xl mx-8 my-3 text-center'>
        <TableHeader className='dark:bg-background'>
          <TableRow>
            <TableHead className='uppercase font-bold text-center'>#</TableHead>
            <TableHead className='uppercase font-bold text-center'>{t('name')}</TableHead>
            <TableHead className='uppercase font-bold text-center'>{t('status')}</TableHead>
            <TableHead className='uppercase font-bold text-center'>{t('course_enrolled')}</TableHead>
            <TableHead className='uppercase font-bold text-center'>{t('action')}</TableHead>
            <TableHead className='uppercase font-bold text-center'>{t('details')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!dataLoaded ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className='font-medium'>
                  <Skeleton className='w-6 h-6 mx-auto' />
                </TableCell>
                <TableCell>
                  <Skeleton className='w-24 h-6 mx-auto' />
                </TableCell>
                <TableCell>
                  <Skeleton className='w-16 h-6 mx-auto' />
                </TableCell>
                <TableCell>
                  <Skeleton className='w-16 h-6 mx-auto' />
                </TableCell>
                <TableCell>
                  <Skeleton className='w-16 h-6 mx-auto' />
                </TableCell>
                <TableCell>
                  <Skeleton className='w-16 h-6 mx-auto' />
                </TableCell>
              </TableRow>
            ))
          ) : users?.length > 0 ? (
            users.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell className='font-medium'>{index + 1}</TableCell>
                <TableCell>{user.full_name}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      user.account?.status === 'active'
                        ? 'bg-green-600 hover:bg-green-600 rounded-full cursor-pointer'
                        : 'bg-red-600 hover:bg-red-700 rounded-full cursor-pointer'
                    }
                  >
                    {user.account?.status}
                  </Badge>
                </TableCell>
                <TableCell>{user.courses.length}</TableCell>
                <TableCell>
                  <div className='flex items-center justify-center cursor-pointer'>
                    {user.account?.status === 'active' ? (
                      <XCircleIcon
                        className='rounded-full w-7 h-7 text-red-600 hover:bg-red-700 hover:text-white'
                        onClick={() => handleBanActivate(user)}
                      />
                    ) : (
                      <CheckIcon
                        className='rounded-full w-7 h-7 text-green-600 hover:bg-green-700 hover:text-white'
                        onClick={() => handleBanActivate(user)}
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger className='cursor-pointer'>
                      <DocumentMagnifyingGlassIcon className='w-6 h-6' />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t('profile1')}</AlertDialogTitle>
                        <AlertDialogDescription>
                          <div className='flex space-x-4'>
                            <div>
                              <Image
                                src={user.image_url || avtDefault.src}
                                alt={t('avatarAlt')}
                                width={100}
                                height={100}
                              />
                            </div>
                            <div>
                              <p>
                                <strong>{t('fullName')}:</strong> {user.full_name}
                              </p>
                              <p>
                                <strong>{t('email')}:</strong> {user.account?.email}
                              </p>
                              <p>
                                <strong>{t('status')}:</strong> {user.account?.status}
                              </p>
                              <p>
                                <strong>{t('createdAt')}:</strong>{' '}
                                {user.created_at ? new Date(user.created_at).toISOString().split('T')[0] : 'N/A'}
                              </p>
                              <p>
                                <strong>{t('updatedAt')}:</strong>{' '}
                                {user.updated_at ? new Date(user.updated_at).toISOString().split('T')[0] : 'N/A'}
                              </p>
                              <p>
                                <strong>{t('sex')}:</strong> {user.sex}
                              </p>
                              <p>
                                <strong>{t('bio')}:</strong> {user.bio}
                              </p>
                              <p>
                                <strong>{t('goals')}:</strong> {user.goals}
                              </p>
                            </div>
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogAction>{t('cancel')}</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className='text-center'>
                <div className='flex justify-center'>
                  <Image src={Img} alt='' width={500} height={500} className='mx-auto' />
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default UserTable
