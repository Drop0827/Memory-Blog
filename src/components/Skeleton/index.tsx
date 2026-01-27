import { cn } from '@/lib/utils';
import './index.scss';

export default ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn('skeleton rounded-md bg-gray-200 dark:bg-gray-800', className)} {...props} />;
};
