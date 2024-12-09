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
import { RequestAssign } from '@/src/app/types/requestAssign.type'

interface RequestAssignTableProps {
  requests: RequestAssign[]
  dataLoaded: boolean
  handleAcceptReject: (request: RequestAssign, status: 'accepted' | 'rejected') => void
}

const RequestAssignTable: React.FC<RequestAssignTableProps> = ({ requests, dataLoaded, handleAcceptReject }) => {
  const t = useTranslations('list_requests_assign')

  return (
    <div className='w-[98%] flex justify-center rounded-lg shadow-xl m-5'>
      <Table className='w-full max-w-6xl mx-8 my-3'>
        <TableHeader className='dark:bg-background'>
          <TableRow>
            <TableHead className='uppercase font-bold text-center'>#</TableHead>
            <TableHead className='uppercase font-bold text-center'>{t('student')}</TableHead>
            <TableHead className='uppercase font-bold text-center'>{t('req_title')}</TableHead>
            <TableHead className='uppercase font-bold text-center'>{t('status')}</TableHead>
            <TableHead className='uppercase font-bold text-center'>{t('level')}</TableHead>
            <TableHead className='uppercase font-bold text-center'>{t('action')}</TableHead>
            <TableHead className='uppercase font-bold text-center'>{t('details')}</TableHead>
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
              </TableRow>
            ))
          ) : requests?.length > 0 ? (
            requests.map((request, index) => (
              <TableRow key={request.id}>
                <TableCell className='font-medium'>{index + 1}</TableCell>
                <TableCell className='text-center'>{request?.full_name}</TableCell>
                <TableCell>{request?.course_title}</TableCell>
                <TableCell className='text-center'>
                  <Badge
                    className={`${
                      {
                        accepted: 'bg-green-600 hover:bg-green-600',
                        pending: 'bg-yellow-600 hover:bg-yellow-600',
                        rejected: 'bg-red-600 hover:bg-red-700'
                      }[request.status as 'accepted' | 'pending' | 'rejected']
                    } rounded-full cursor-pointer`}
                  >
                    {t(request.status)}
                  </Badge>
                </TableCell>
                <TableCell className='text-center'>
                  <Badge
                    className={`${
                      {
                        N1: 'bg-blue-600 hover:bg-blue-700',
                        N2: 'bg-purple-600 hover:bg-purple-700',
                        N3: 'bg-green-600 hover:bg-green-700',
                        N4: 'bg-yellow-600 hover:bg-yellow-700'
                      }[request?.course_level as 'N1' | 'N2' | 'N3' | 'N4'] || 'bg-gray-600 hover:bg-gray-700'
                    } rounded-full cursor-pointer`}
                  >
                    {request?.course_level}
                  </Badge>
                </TableCell>
                <TableCell className='text-center'>
                  <div className='flex items-center justify-center cursor-pointer'>
                    {request.status === 'pending' ? (
                      <div className='flex gap-5'>
                        <CheckIcon
                          className='rounded-full w-7 h-7 text-green-600 hover:bg-green-700 hover:text-white'
                          onClick={() => handleAcceptReject(request, 'accepted')}
                        />
                        <XCircleIcon
                          className='rounded-full w-7 h-7 text-red-600 hover:bg-red-700 hover:text-white'
                          onClick={() => handleAcceptReject(request, 'rejected')}
                        />
                      </div>
                    ) : (
                      <Badge variant='outline' className='rounded-full cursor-pointer'>
                        {t('resolved')}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className='text-center'>
                  <AlertDialog>
                    <AlertDialogTrigger className='cursor-pointer'>
                      <DocumentMagnifyingGlassIcon className='w-6 h-6' />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t('request_details')}</AlertDialogTitle>
                        <AlertDialogDescription>
                          <div className='flex space-x-4'>
                            <div>
                              <Image
                                src={request.course_image_url || avtDefault.src}
                                alt={t('avatarAlt')}
                                width={100}
                                height={100}
                              />
                            </div>
                            <div>
                              <p>
                                <strong>{t('title')}:</strong> {request?.course_title}
                              </p>
                              <p>
                                <strong>{t('user_request')}:</strong> {request?.full_name}
                              </p>
                              <p>
                                <strong>{t('status')}:</strong> {request?.status}
                              </p>
                              <p>
                                <strong>{t('createdAt')}:</strong>{' '}
                                {request?.created_at
                                  ? new Date(request?.created_at).toISOString().split('T')[0]
                                  : 'N/A'}
                              </p>
                              <p>
                                <strong>{t('level')}:</strong> {request?.course_level}
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

export default RequestAssignTable
