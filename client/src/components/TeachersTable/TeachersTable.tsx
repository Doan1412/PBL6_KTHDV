import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table'
import { Badge } from '@/src/components/ui/badge'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Img from '@/src/app/assets/no_data.svg'
import { Skeleton } from '@/src/components/ui/skeleton'
import { Teacher } from '@/src/app/types/teacher.type'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/src/components/ui/alert-dialog'
import { DocumentMagnifyingGlassIcon } from '@heroicons/react/24/solid'
import avtDefault from '@/src/app/assets/avtDefault.png'
import { BsTrashFill } from 'react-icons/bs'
import { Button } from '@/src/components/ui/button'
import http from '@/src/app/utils/http'
import { useAppDispatch } from '@/src/app/hooks/store'
import { failPopUp, successPopUp } from '@/src/app/hooks/features/popup.slice'
import { Dispatch, SetStateAction } from 'react'

interface TeacherTableProps {
  teachers: Teacher[]
  dataLoaded: boolean
  setTeachers: Dispatch<SetStateAction<Teacher[]>>
}

const TeachersTable: React.FC<TeacherTableProps> = ({ teachers, dataLoaded, setTeachers }) => {
  const t = useTranslations('list_teacher')
  const dispatch = useAppDispatch()

  const handleDeleteTeacher = async (id_teacher: number) => {
    try {
      await http.delete(`admin/teachers/${id_teacher}`)
      dispatch(successPopUp(t('delete_success')))
      setTeachers((prevTeachers) => {
        const updatedTeachers = prevTeachers.filter((teacher) => teacher.id !== id_teacher)
        return updatedTeachers
      })
    } catch {
      dispatch(failPopUp(t('delete_fail')))
    }
  }

  return (
    <div className='w-[98%] flex justify-center rounded-lg shadow-xl m-5'>
      <Table className='w-full max-w-6xl mx-8 my-3'>
        <TableHeader className='dark:bg-background'>
          <TableRow>
            <TableHead className='uppercase font-bold text-center'>#</TableHead>
            <TableHead className='uppercase font-bold text-center'>{t('name')}</TableHead>
            <TableHead className='uppercase font-bold text-center'>{t('course_count')}</TableHead>
            <TableHead className='uppercase font-bold text-center'>{t('student_count')}</TableHead>
            <TableHead className='uppercase font-bold text-center'>{t('follower_count')}</TableHead>
            <TableHead className='uppercase font-bold text-center'>{t('action')}</TableHead>
            <TableHead className='uppercase font-bold text-center'>{t('view_teacher')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!dataLoaded ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className='font-medium'>
                  <Skeleton className='w-1/2 h-6 mx-auto' />
                </TableCell>
                <TableCell>
                  <Skeleton className='w-1/2 h-6 mx-auto' />
                </TableCell>
                <TableCell>
                  <Skeleton className='w-1/2 h-6 mx-auto' />
                </TableCell>
                <TableCell>
                  <Skeleton className='w-1/2 h-6 mx-auto' />
                </TableCell>
                <TableCell>
                  <Skeleton className='w-1/2 h-6 mx-auto' />
                </TableCell>
                <TableCell>
                  <Skeleton className='w-1/2 h-6 mx-auto' />
                </TableCell>
                <TableCell>
                  <Skeleton className='w-1/2 h-6 mx-auto' />
                </TableCell>
              </TableRow>
            ))
          ) : teachers?.length > 0 ? (
            teachers.map((teacher, index) => (
              <TableRow key={teacher.id}>
                <TableCell className='font-medium'>{index + 1}</TableCell>
                <TableCell>{teacher?.name}</TableCell>
                <TableCell className='text-center'>{teacher?.course_count}</TableCell>
                <TableCell className='text-center'>{teacher?.student_count}</TableCell>
                <TableCell className='text-center'>{teacher?.follower_count}</TableCell>
                <TableCell>
                  <div className='flex items-center justify-center cursor-pointer'>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant='link'>
                          <BsTrashFill color='red' size={25} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t('confirm_delete')}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t('content_delete_teacher')} <strong>{teacher?.name}</strong>?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                          <AlertDialogAction>
                            {' '}
                            <Button
                              type='submit'
                              onClick={() => {
                                handleDeleteTeacher(teacher?.id as number)
                              }}
                            >
                              {t('delete')}
                            </Button>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
                <TableCell className='cursor-pointer'>
                  <div className='flex justify-center'>
                    <AlertDialog>
                      <AlertDialogTrigger className='cursor-pointer'>
                        <DocumentMagnifyingGlassIcon className='w-6 h-6' />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t('view_details_teacher')}</AlertDialogTitle>
                          <AlertDialogDescription>
                            <div className='flex space-x-4'>
                              <div>
                                <Image
                                  src={teacher?.image_url || avtDefault.src}
                                  alt={t('avatarAlt')}
                                  width={100}
                                  height={100}
                                />
                              </div>
                              <div>
                                <p>
                                  <strong>{t('name')}:</strong> {teacher?.name}
                                </p>
                                <p>
                                  <strong>{t('email')}:</strong> {teacher?.account?.email}
                                </p>
                                <p>
                                  <strong>{t('job_title')}:</strong> {teacher?.job_title}
                                </p>
                                <p>
                                  <strong>{t('experience')}:</strong> {teacher?.experience}
                                </p>
                                <p>
                                  <strong>{t('bio')}:</strong> {teacher?.bio}
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
                  </div>
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

export default TeachersTable
